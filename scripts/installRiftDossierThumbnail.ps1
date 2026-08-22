<#
.SYNOPSIS
Installs a landscape OpenAI ImageGen rift-dossier thumbnail and its provenance.

.DESCRIPTION
Transforms a source PNG into a fixed landscape thumbnail without distortion,
then atomically installs the image and one JSONL provenance entry. The script
never overwrites an image or matching ledger entry unless -Replace is supplied.

Local sharp is preferred for PNG/WebP output. When sharp is unavailable,
Pillow is used when detected. Windows System.Drawing remains the final PNG
fallback, while WebP exits clearly if neither sharp nor Pillow is available.

.EXAMPLE
powershell -NoProfile -File scripts/installRiftDossierThumbnail.ps1 `
  -Source C:\temp\imagegen.png `
  -Destination public\images\rift-dossiers\openai\mission-9001-example-v1.png `
  -AssetId mission-9001-example-v1 `
  -MissionId 9001 `
  -PromptFile C:\temp\mission-9001-prompt.txt

.EXAMPLE
powershell -NoProfile -File scripts/installRiftDossierThumbnail.ps1 `
  -Destination public\images\rift-dossiers\openai\mission-9001-example-v1.png `
  -Ledger public\images\rift-dossiers\openai\openai-prompts.jsonl `
  -AssetId mission-9001-example-v1 `
  -VerifyOnly
#>

[CmdletBinding()]
param(
    [string]$Source,
    [Parameter(Mandatory = $true)]
    [string]$Destination,
    [Parameter(Mandatory = $true)]
    [string]$AssetId,
    [string]$Ledger = 'public/images/rift-dossiers/openai/openai-prompts.jsonl',
    [string]$OutputPath,
    [Nullable[int]]$MissionId,
    [string]$PromptFile,
    [string]$PromptSha256,
    [string]$GenerationId,
    [string]$GeneratedAt,
    [ValidateSet('Cover', 'Contain')]
    [string]$Fit = 'Cover',
    [ValidateRange(2, 8192)]
    [int]$Width = 640,
    [ValidateRange(2, 8192)]
    [int]$Height = 360,
    [ValidateRange(1, 100)]
    [int]$WebPQuality = 86,
    [string]$Background = '#000000',
    [switch]$Replace,
    [switch]$VerifyOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$script:RepositoryRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$script:SharpBridge = Join-Path $PSScriptRoot 'riftDossierSharpProcessor.mjs'
$script:PillowBridge = Join-Path $PSScriptRoot 'rift_dossier_pillow_processor.py'
$script:PillowPython = $null
$script:Utf8NoBom = New-Object Text.UTF8Encoding($false)

function Resolve-PipelinePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    if ([IO.Path]::IsPathRooted($Value)) {
        return [IO.Path]::GetFullPath($Value)
    }
    return [IO.Path]::GetFullPath((Join-Path $script:RepositoryRoot $Value))
}

function Get-Sha256 {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $algorithm = [Security.Cryptography.SHA256]::Create()
    $stream = [IO.File]::OpenRead($Path)
    try {
        return ([BitConverter]::ToString($algorithm.ComputeHash($stream))).Replace('-', '').ToLowerInvariant()
    }
    finally {
        $stream.Dispose()
        $algorithm.Dispose()
    }
}

function Get-TextSha256 {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $algorithm = [Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [Text.Encoding]::UTF8.GetBytes($Text)
        return ([BitConverter]::ToString($algorithm.ComputeHash($bytes))).Replace('-', '').ToLowerInvariant()
    }
    finally {
        $algorithm.Dispose()
    }
}

function Test-PngSignature {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $expected = [byte[]](137, 80, 78, 71, 13, 10, 26, 10)
    $stream = [IO.File]::OpenRead($Path)
    try {
        if ($stream.Length -lt $expected.Length) {
            return $false
        }
        foreach ($value in $expected) {
            if ($stream.ReadByte() -ne $value) {
                return $false
            }
        }
        return $true
    }
    finally {
        $stream.Dispose()
    }
}

function Test-SharpAvailable {
    $packagePath = Join-Path $script:RepositoryRoot 'node_modules/sharp/package.json'
    return (Test-Path -LiteralPath $packagePath -PathType Leaf)
}

function Test-PillowAvailable {
    try {
        $launcher = Get-Command py -ErrorAction Stop
        $lines = @(
            & $launcher.Source -c 'import sys; from PIL import Image; print(sys.executable)' 2>$null
        )
        if ($LASTEXITCODE -ne 0 -or $lines.Count -eq 0) {
            return $false
        }
        $candidate = [string]$lines[$lines.Count - 1]
        if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
            return $false
        }
        $script:PillowPython = $candidate
        return $true
    }
    catch {
        return $false
    }
}

function Get-ImageMetadata {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [bool]$SharpAvailable,
        [Parameter(Mandatory = $true)]
        [bool]$PillowAvailable
    )

    $extension = [IO.Path]::GetExtension($Path).ToLowerInvariant()
    if ($extension -eq '.webp') {
        if ($SharpAvailable) {
            $lines = @(& node $script:SharpBridge --source $Path --metadata 2>&1)
            if ($LASTEXITCODE -ne 0) {
                throw "sharp metadata failed: $($lines -join ' ')"
            }
            return (($lines -join [Environment]::NewLine) | ConvertFrom-Json)
        }
        if (-not $PillowAvailable) {
            throw 'WebP validation requires local sharp or Pillow.'
        }
        $lines = @(& $script:PillowPython $script:PillowBridge --source $Path --metadata 2>&1)
        if ($LASTEXITCODE -ne 0) {
            throw "Pillow metadata failed: $($lines -join ' ')"
        }
        return (($lines -join [Environment]::NewLine) | ConvertFrom-Json)
    }

    Add-Type -AssemblyName System.Drawing
    $image = [Drawing.Image]::FromFile($Path)
    try {
        return [pscustomobject]@{
            width = $image.Width
            height = $image.Height
            format = 'png'
        }
    }
    finally {
        $image.Dispose()
    }
}

function Invoke-SystemDrawingTransform {
    param(
        [Parameter(Mandatory = $true)]
        [string]$InputPath,
        [Parameter(Mandatory = $true)]
        [string]$TemporaryOutput,
        [Parameter(Mandatory = $true)]
        [int]$TargetWidth,
        [Parameter(Mandatory = $true)]
        [int]$TargetHeight,
        [Parameter(Mandatory = $true)]
        [string]$FitMode,
        [Parameter(Mandatory = $true)]
        [string]$BackgroundColor
    )

    Add-Type -AssemblyName System.Drawing
    $sourceImage = [Drawing.Image]::FromFile($InputPath)
    $bitmap = New-Object Drawing.Bitmap(
        $TargetWidth,
        $TargetHeight,
        [Drawing.Imaging.PixelFormat]::Format32bppArgb
    )
    $graphics = [Drawing.Graphics]::FromImage($bitmap)

    try {
        $graphics.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
        $color = [Drawing.ColorTranslator]::FromHtml($BackgroundColor)
        $graphics.Clear($color)

        $sourceRatio = [double]$sourceImage.Width / [double]$sourceImage.Height
        $targetRatio = [double]$TargetWidth / [double]$TargetHeight

        if ($FitMode -eq 'Cover') {
            if ($sourceRatio -gt $targetRatio) {
                $cropHeight = [double]$sourceImage.Height
                $cropWidth = $cropHeight * $targetRatio
                $cropX = ([double]$sourceImage.Width - $cropWidth) / 2.0
                $cropY = 0.0
            }
            else {
                $cropWidth = [double]$sourceImage.Width
                $cropHeight = $cropWidth / $targetRatio
                $cropX = 0.0
                $cropY = ([double]$sourceImage.Height - $cropHeight) / 2.0
            }

            $destinationRectangle = New-Object Drawing.RectangleF(0, 0, $TargetWidth, $TargetHeight)
            $sourceRectangle = New-Object Drawing.RectangleF(
                [single]$cropX,
                [single]$cropY,
                [single]$cropWidth,
                [single]$cropHeight
            )
        }
        else {
            $scale = [Math]::Min(
                [double]$TargetWidth / [double]$sourceImage.Width,
                [double]$TargetHeight / [double]$sourceImage.Height
            )
            $drawWidth = [double]$sourceImage.Width * $scale
            $drawHeight = [double]$sourceImage.Height * $scale
            $drawX = ([double]$TargetWidth - $drawWidth) / 2.0
            $drawY = ([double]$TargetHeight - $drawHeight) / 2.0
            $destinationRectangle = New-Object Drawing.RectangleF(
                [single]$drawX,
                [single]$drawY,
                [single]$drawWidth,
                [single]$drawHeight
            )
            $sourceRectangle = New-Object Drawing.RectangleF(
                0,
                0,
                $sourceImage.Width,
                $sourceImage.Height
            )
        }

        $graphics.DrawImage(
            $sourceImage,
            $destinationRectangle,
            $sourceRectangle,
            [Drawing.GraphicsUnit]::Pixel
        )
        $bitmap.Save($TemporaryOutput, [Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $graphics.Dispose()
        $bitmap.Dispose()
        $sourceImage.Dispose()
    }
}

function Invoke-ImageTransform {
    param(
        [Parameter(Mandatory = $true)]
        [string]$InputPath,
        [Parameter(Mandatory = $true)]
        [string]$TemporaryOutput,
        [Parameter(Mandatory = $true)]
        [bool]$SharpAvailable,
        [Parameter(Mandatory = $true)]
        [bool]$PillowAvailable
    )

    $extension = [IO.Path]::GetExtension($TemporaryOutput).ToLowerInvariant()
    if ($SharpAvailable) {
        $lines = @(
            & node $script:SharpBridge `
                --source $InputPath `
                --output $TemporaryOutput `
                --width $Width `
                --height $Height `
                --fit $Fit.ToLowerInvariant() `
                --background $Background `
                --quality $WebPQuality 2>&1
        )
        if ($LASTEXITCODE -ne 0) {
            throw "sharp processing failed: $($lines -join ' ')"
        }
        return 'sharp'
    }

    if ($PillowAvailable) {
        $lines = @(
            & $script:PillowPython $script:PillowBridge `
                --source $InputPath `
                --output $TemporaryOutput `
                --width $Width `
                --height $Height `
                --fit $Fit.ToLowerInvariant() `
                --background $Background `
                --quality $WebPQuality 2>&1
        )
        if ($LASTEXITCODE -ne 0) {
            throw "Pillow processing failed: $($lines -join ' ')"
        }
        return 'pillow'
    }

    if ($extension -eq '.webp') {
        throw 'WebP output requires sharp or Pillow. Use PNG or install one of these raster backends.'
    }

    Invoke-SystemDrawingTransform `
        -InputPath $InputPath `
        -TemporaryOutput $TemporaryOutput `
        -TargetWidth $Width `
        -TargetHeight $Height `
        -FitMode $Fit `
        -BackgroundColor $Background
    return 'system-drawing'
}

function Get-LedgerDocument {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        return [pscustomobject]@{
            Text = ''
            Records = @()
        }
    }

    $text = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8)
    $records = @()
    $matches = [Text.RegularExpressions.Regex]::Matches(
        $text,
        '([^\r\n]*)(\r\n|\n|\r|$)'
    )
    $lineNumber = 0
    foreach ($match in $matches) {
        if ($match.Length -eq 0) {
            continue
        }
        $lineNumber += 1
        $raw = $match.Groups[1].Value
        $entry = $null
        if (-not [string]::IsNullOrWhiteSpace($raw)) {
            try {
                $entry = $raw | ConvertFrom-Json
            }
            catch {
                throw "Malformed JSONL ledger entry at line ${lineNumber}: $($_.Exception.Message)"
            }
        }
        $records += [pscustomobject]@{
            LineNumber = $lineNumber
            Raw = $raw
            Segment = $match.Value
            Entry = $entry
        }
    }

    return [pscustomobject]@{
        Text = $text
        Records = $records
    }
}

function Test-EntryMatch {
    param(
        [Parameter(Mandatory = $true)]
        $Entry,
        [Parameter(Mandatory = $true)]
        [string]$ExpectedAssetId,
        [Parameter(Mandatory = $true)]
        [string]$ExpectedOutput
    )

    if ($null -eq $Entry) {
        return $false
    }
    $assetMatches = (
        $Entry.PSObject.Properties.Name -contains 'assetId' -and
        $Entry.assetId -eq $ExpectedAssetId
    )
    $outputMatches = (
        $Entry.PSObject.Properties.Name -contains 'output' -and
        $Entry.output -eq $ExpectedOutput
    )
    return ($assetMatches -or $outputMatches)
}

function Get-AppendedLedgerText {
    param(
        [Parameter(Mandatory = $true)]
        $Document,
        [Parameter(Mandatory = $true)]
        [string]$Json,
        [Parameter(Mandatory = $true)]
        [bool]$AllowReplace,
        [Parameter(Mandatory = $true)]
        [string]$ExpectedAssetId,
        [Parameter(Mandatory = $true)]
        [string]$ExpectedOutput
    )

    $matching = @(
        $Document.Records | Where-Object {
            Test-EntryMatch `
                -Entry $_.Entry `
                -ExpectedAssetId $ExpectedAssetId `
                -ExpectedOutput $ExpectedOutput
        }
    )
    if ($matching.Count -gt 0 -and -not $AllowReplace) {
        throw "Ledger already contains $($matching.Count) matching entry or entries. Use -Replace explicitly."
    }

    if ($AllowReplace -and $matching.Count -gt 0) {
        $matchingLines = @{}
        foreach ($record in $matching) {
            $matchingLines[$record.LineNumber] = $true
        }
        $baseText = (
            $Document.Records |
                Where-Object { -not $matchingLines.ContainsKey($_.LineNumber) } |
                ForEach-Object { $_.Segment }
        ) -join ''
    }
    else {
        $baseText = $Document.Text
    }

    if ($baseText.Length -gt 0 -and -not $baseText.EndsWith("`n") -and -not $baseText.EndsWith("`r")) {
        $baseText += [Environment]::NewLine
    }
    return "$baseText$Json$([Environment]::NewLine)"
}

function Enter-LedgerLock {
    param(
        [Parameter(Mandatory = $true)]
        [string]$LockPath
    )

    for ($attempt = 0; $attempt -lt 50; $attempt += 1) {
        try {
            return [IO.File]::Open(
                $LockPath,
                [IO.FileMode]::OpenOrCreate,
                [IO.FileAccess]::ReadWrite,
                [IO.FileShare]::None
            )
        }
        catch [IO.IOException] {
            if ($attempt -eq 49) {
                throw "Could not acquire ledger lock after five seconds: $LockPath"
            }
            Start-Sleep -Milliseconds 100
        }
    }
}

function Get-DefaultOutputPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$DestinationPath
    )

    $rootPrefix = $script:RepositoryRoot.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
    if ($DestinationPath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        $relative = $DestinationPath.Substring($rootPrefix.Length).Replace('\', '/')
        if ($relative.StartsWith('public/', [StringComparison]::OrdinalIgnoreCase)) {
            return '/' + $relative.Substring('public/'.Length)
        }
        return $relative
    }
    return $DestinationPath.Replace('\', '/')
}

function Assert-HexSha256 {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Value,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if ($Value -notmatch '^[a-fA-F0-9]{64}$') {
        throw "$Label must be a 64-character hexadecimal SHA-256."
    }
}

function Assert-VerifiedInstallation {
    param(
        [Parameter(Mandatory = $true)]
        [string]$DestinationPath,
        [Parameter(Mandatory = $true)]
        [string]$LedgerPath,
        [Parameter(Mandatory = $true)]
        [string]$ExpectedOutput,
        [Parameter(Mandatory = $true)]
        [bool]$SharpAvailable,
        [Parameter(Mandatory = $true)]
        [bool]$PillowAvailable
    )

    if (-not (Test-Path -LiteralPath $DestinationPath -PathType Leaf)) {
        throw "Installed image is missing: $DestinationPath"
    }
    $metadata = Get-ImageMetadata `
        -Path $DestinationPath `
        -SharpAvailable $SharpAvailable `
        -PillowAvailable $PillowAvailable
    $hash = Get-Sha256 -Path $DestinationPath
    $document = Get-LedgerDocument -Path $LedgerPath
    $matching = @(
        $document.Records | Where-Object {
            Test-EntryMatch -Entry $_.Entry -ExpectedAssetId $AssetId -ExpectedOutput $ExpectedOutput
        }
    )
    if ($matching.Count -ne 1) {
        throw "Expected exactly one matching provenance entry; found $($matching.Count)."
    }

    $entry = $matching[0].Entry
    if ($entry.kind -ne 'rift-dossier-thumbnail') {
        throw 'Matching ledger entry has an unsupported kind.'
    }
    if (
        $entry.generation.provider -ne 'OpenAI' -or
        $entry.generation.interface -ne 'built-in image_gen' -or
        $entry.generation.model -ne 'built-in/imagegen'
    ) {
        throw 'Matching ledger entry does not declare built-in OpenAI ImageGen provenance.'
    }
    if ($entry.image.sha256 -ne $hash) {
        throw 'Installed image SHA-256 does not match the ledger.'
    }
    if (
        [int]$entry.image.width -ne [int]$metadata.width -or
        [int]$entry.image.height -ne [int]$metadata.height
    ) {
        throw 'Installed image dimensions do not match the ledger.'
    }
    if ($PromptSha256) {
        Assert-HexSha256 -Value $PromptSha256 -Label '-PromptSha256'
        if ($entry.generation.promptSha256 -ne $PromptSha256.ToLowerInvariant()) {
            throw 'Prompt SHA-256 does not match the ledger.'
        }
    }

    return [pscustomobject]@{
        verified = $true
        assetId = $AssetId
        output = $ExpectedOutput
        width = [int]$metadata.width
        height = [int]$metadata.height
        sha256 = $hash
        ledger = $LedgerPath
    }
}

function Restore-TransactionalFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$CurrentPath,
        [string]$BackupPath,
        [Parameter(Mandatory = $true)]
        [bool]$PreviouslyExisted
    )

    if (Test-Path -LiteralPath $CurrentPath) {
        [IO.File]::Delete($CurrentPath)
    }
    if ($PreviouslyExisted -and $BackupPath -and (Test-Path -LiteralPath $BackupPath)) {
        [IO.File]::Move($BackupPath, $CurrentPath)
    }
}

function Invoke-Pipeline {
    if ([string]::IsNullOrWhiteSpace($AssetId)) {
        throw '-AssetId cannot be empty.'
    }
    if ($Width -le $Height) {
        throw 'Landscape output requires -Width to be greater than -Height.'
    }

    $destinationPath = Resolve-PipelinePath -Value $Destination
    $ledgerPath = Resolve-PipelinePath -Value $Ledger
    $extension = [IO.Path]::GetExtension($destinationPath).ToLowerInvariant()
    if ($extension -notin @('.png', '.webp')) {
        throw '-Destination must end in .png or .webp.'
    }
    if ($destinationPath -eq $ledgerPath) {
        throw 'Image destination and ledger must be different files.'
    }

    $expectedOutput = if ($OutputPath) {
        $OutputPath.Replace('\', '/')
    }
    else {
        Get-DefaultOutputPath -DestinationPath $destinationPath
    }
    $sharpAvailable = Test-SharpAvailable
    $pillowAvailable = Test-PillowAvailable

    if ($VerifyOnly) {
        return Assert-VerifiedInstallation `
            -DestinationPath $destinationPath `
            -LedgerPath $ledgerPath `
            -ExpectedOutput $expectedOutput `
            -SharpAvailable $sharpAvailable `
            -PillowAvailable $pillowAvailable
    }

    if ([string]::IsNullOrWhiteSpace($Source)) {
        throw '-Source is required unless -VerifyOnly is used.'
    }
    $sourcePath = Resolve-PipelinePath -Value $Source
    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
        throw "Source PNG does not exist: $sourcePath"
    }
    if ([IO.Path]::GetExtension($sourcePath).ToLowerInvariant() -ne '.png') {
        throw '-Source must be a PNG file.'
    }
    if (-not (Test-PngSignature -Path $sourcePath)) {
        throw 'Source does not have a valid PNG signature.'
    }
    if ($sourcePath -eq $destinationPath) {
        throw 'Source and destination must be different files.'
    }
    if ((Test-Path -LiteralPath $destinationPath) -and -not $Replace) {
        throw "Destination already exists. Use -Replace explicitly: $destinationPath"
    }

    $resolvedPromptSha = $null
    $resolvedPromptText = $null
    if ($PromptFile) {
        $promptPath = Resolve-PipelinePath -Value $PromptFile
        if (-not (Test-Path -LiteralPath $promptPath -PathType Leaf)) {
            throw "Prompt file does not exist: $promptPath"
        }
        $resolvedPromptText = [IO.File]::ReadAllText($promptPath, [Text.Encoding]::UTF8)
        $resolvedPromptSha = Get-TextSha256 -Text $resolvedPromptText
    }
    if ($PromptSha256) {
        Assert-HexSha256 -Value $PromptSha256 -Label '-PromptSha256'
        $suppliedPromptSha = $PromptSha256.ToLowerInvariant()
        if ($resolvedPromptSha -and $resolvedPromptSha -ne $suppliedPromptSha) {
            throw '-PromptFile content does not match -PromptSha256.'
        }
        $resolvedPromptSha = $suppliedPromptSha
    }
    if (-not $resolvedPromptSha) {
        throw 'Supply -PromptFile or -PromptSha256 to record ImageGen provenance.'
    }

    if ($GeneratedAt) {
        try {
            $generationDate = [DateTimeOffset]::Parse(
                $GeneratedAt,
                [Globalization.CultureInfo]::InvariantCulture
            ).ToUniversalTime().ToString('o')
        }
        catch {
            throw '-GeneratedAt must be a valid date or date-time.'
        }
    }
    else {
        $generationDate = [DateTimeOffset]::UtcNow.ToString('o')
    }

    $destinationDirectory = [IO.Path]::GetDirectoryName($destinationPath)
    $ledgerDirectory = [IO.Path]::GetDirectoryName($ledgerPath)
    [IO.Directory]::CreateDirectory($destinationDirectory) | Out-Null
    [IO.Directory]::CreateDirectory($ledgerDirectory) | Out-Null

    $token = [Guid]::NewGuid().ToString('N')
    $temporaryImage = Join-Path $destinationDirectory ".$([IO.Path]::GetFileName($destinationPath)).install-$token$extension"
    $temporaryLedger = Join-Path $ledgerDirectory ".$([IO.Path]::GetFileName($ledgerPath)).install-$token"
    $imageBackup = Join-Path $destinationDirectory ".$([IO.Path]::GetFileName($destinationPath)).backup-$token"
    $ledgerBackup = Join-Path $ledgerDirectory ".$([IO.Path]::GetFileName($ledgerPath)).backup-$token"
    $lockPath = "$ledgerPath.install.lock"
    $lockStream = $null
    $destinationCommitted = $false
    $ledgerCommitted = $false
    $destinationPreviouslyExisted = $false
    $ledgerPreviouslyExisted = $false
    $success = $false

    try {
        $sourceMetadata = Get-ImageMetadata `
            -Path $sourcePath `
            -SharpAvailable $sharpAvailable `
            -PillowAvailable $pillowAvailable
        $sourceHash = Get-Sha256 -Path $sourcePath
        $backend = Invoke-ImageTransform `
            -InputPath $sourcePath `
            -TemporaryOutput $temporaryImage `
            -SharpAvailable $sharpAvailable `
            -PillowAvailable $pillowAvailable
        $outputMetadata = Get-ImageMetadata `
            -Path $temporaryImage `
            -SharpAvailable $sharpAvailable `
            -PillowAvailable $pillowAvailable
        if (
            [int]$outputMetadata.width -ne $Width -or
            [int]$outputMetadata.height -ne $Height
        ) {
            throw "Processor returned $($outputMetadata.width)x$($outputMetadata.height), expected ${Width}x${Height}."
        }
        $outputHash = Get-Sha256 -Path $temporaryImage
        $outputBytes = (Get-Item -LiteralPath $temporaryImage).Length

        $generation = [ordered]@{
            provider = 'OpenAI'
            interface = 'built-in image_gen'
            model = 'built-in/imagegen'
            generatedAt = $generationDate
            promptSha256 = $resolvedPromptSha
        }
        if ($GenerationId) {
            $generation.generationId = $GenerationId
        }

        $entry = [ordered]@{
            schemaVersion = 1
            kind = 'rift-dossier-thumbnail'
            assetId = $AssetId
            output = $expectedOutput
            sourceImage = [ordered]@{
                fileName = [IO.Path]::GetFileName($sourcePath)
                format = 'PNG'
                width = [int]$sourceMetadata.width
                height = [int]$sourceMetadata.height
                sha256 = $sourceHash
            }
            generation = $generation
            processing = [ordered]@{
                pipeline = 'scripts/installRiftDossierThumbnail.ps1'
                backend = $backend
                fit = $Fit.ToLowerInvariant()
                background = $Background
                webpQuality = $WebPQuality
            }
            image = [ordered]@{
                format = $extension.TrimStart('.').ToUpperInvariant()
                width = $Width
                height = $Height
                bytes = $outputBytes
                sha256 = $outputHash
            }
            installedAt = [DateTimeOffset]::UtcNow.ToString('o')
        }
        if ($null -ne $MissionId) {
            $entry.missionId = [int]$MissionId
        }
        if ($null -ne $resolvedPromptText) {
            $entry.prompt = $resolvedPromptText
        }
        $entryJson = $entry | ConvertTo-Json -Compress -Depth 20

        $lockStream = Enter-LedgerLock -LockPath $lockPath
        $destinationPreviouslyExisted = Test-Path -LiteralPath $destinationPath -PathType Leaf
        $ledgerPreviouslyExisted = Test-Path -LiteralPath $ledgerPath -PathType Leaf
        if ($destinationPreviouslyExisted -and -not $Replace) {
            throw "Destination was created by another process. Use -Replace explicitly: $destinationPath"
        }

        $document = Get-LedgerDocument -Path $ledgerPath
        $newLedgerText = Get-AppendedLedgerText `
            -Document $document `
            -Json $entryJson `
            -AllowReplace $Replace.IsPresent `
            -ExpectedAssetId $AssetId `
            -ExpectedOutput $expectedOutput
        [IO.File]::WriteAllText($temporaryLedger, $newLedgerText, $script:Utf8NoBom)

        if ($destinationPreviouslyExisted) {
            [IO.File]::Replace($temporaryImage, $destinationPath, $imageBackup, $true)
        }
        else {
            [IO.File]::Move($temporaryImage, $destinationPath)
        }
        $destinationCommitted = $true

        try {
            if ($ledgerPreviouslyExisted) {
                [IO.File]::Replace($temporaryLedger, $ledgerPath, $ledgerBackup, $true)
            }
            else {
                [IO.File]::Move($temporaryLedger, $ledgerPath)
            }
            $ledgerCommitted = $true

            $verified = Assert-VerifiedInstallation `
                -DestinationPath $destinationPath `
                -LedgerPath $ledgerPath `
                -ExpectedOutput $expectedOutput `
                -SharpAvailable $sharpAvailable `
                -PillowAvailable $pillowAvailable
            $success = $true
            return [pscustomobject]@{
                installed = $true
                verified = $verified.verified
                assetId = $AssetId
                output = $expectedOutput
                width = $verified.width
                height = $verified.height
                sha256 = $verified.sha256
                bytes = $outputBytes
                backend = $backend
                sharpAvailable = $sharpAvailable
                pillowAvailable = $pillowAvailable
                ledger = $ledgerPath
            }
        }
        catch {
            if ($ledgerCommitted) {
                Restore-TransactionalFile `
                    -CurrentPath $ledgerPath `
                    -BackupPath $ledgerBackup `
                    -PreviouslyExisted $ledgerPreviouslyExisted
                $ledgerCommitted = $false
            }
            if ($destinationCommitted) {
                Restore-TransactionalFile `
                    -CurrentPath $destinationPath `
                    -BackupPath $imageBackup `
                    -PreviouslyExisted $destinationPreviouslyExisted
                $destinationCommitted = $false
            }
            throw
        }
    }
    finally {
        if ($lockStream) {
            $lockStream.Dispose()
        }
        if ($success) {
            if (Test-Path -LiteralPath $imageBackup) {
                [IO.File]::Delete($imageBackup)
            }
            if (Test-Path -LiteralPath $ledgerBackup) {
                [IO.File]::Delete($ledgerBackup)
            }
        }
        foreach ($temporaryPath in @($temporaryImage, $temporaryLedger)) {
            if (Test-Path -LiteralPath $temporaryPath) {
                [IO.File]::Delete($temporaryPath)
            }
        }
        if (Test-Path -LiteralPath $lockPath) {
            try {
                [IO.File]::Delete($lockPath)
            }
            catch {
                # Another waiting process may already own the persistent lock file.
            }
        }
    }
}

try {
    $result = Invoke-Pipeline
    $result | ConvertTo-Json -Depth 10
}
catch {
    Write-Error "[rift-dossier-thumbnail] $($_.Exception.Message)"
    exit 1
}
