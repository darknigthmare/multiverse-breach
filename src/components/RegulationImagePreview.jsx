import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useModalDialog from './collection/useModalDialog.js';
import './RegulationImagePreview.css';

function getPreviewAssets(preview) {
  if (!preview) return [];

  const sheets = Array.isArray(preview.sheets)
    ? preview.sheets.filter(sheet => typeof sheet?.src === 'string' && sheet.src.trim())
    : [];

  if (sheets.length > 0) {
    return sheets.map((sheet, index) => ({
      id: sheet.id || `${sheet.src}-${index}`,
      src: sheet.src,
      label: sheet.label || '',
      alt: sheet.alt || [preview.title, sheet.label].filter(Boolean).join(' - ')
    }));
  }

  if (typeof preview.src !== 'string' || !preview.src.trim()) return [];

  return [{
    id: preview.src,
    src: preview.src,
    label: '',
    alt: preview.alt || preview.title || ''
  }];
}

export default function RegulationImagePreview({
  preview,
  onClose,
  lang = 'fr',
  pixelated = true,
  className = ''
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [failedAssets, setFailedAssets] = useState(() => new Set());
  const assets = useMemo(() => getPreviewAssets(preview), [preview]);
  const assetKey = assets.map(asset => `${asset.id}:${asset.src}`).join('|');
  const isOpen = Boolean(preview && assets.length > 0);
  const isGallery = assets.length > 1;
  const closeLabel = lang === 'fr' ? 'Fermer la previsualisation' : 'Close preview';

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setFailedAssets(new Set());
  }, [assetKey]);

  useModalDialog({ open: isOpen, overlayRef, dialogRef, initialFocusRef: closeButtonRef, onClose });

  if (!isOpen || typeof document === 'undefined') return null;

  const closePreview = () => onCloseRef.current?.();
  const markAssetFailed = (assetId) => {
    setFailedAssets(current => {
      const next = new Set(current);
      next.add(assetId);
      return next;
    });
  };

  return createPortal(
    <div
      ref={overlayRef}
      className={`arca-preview-backdrop ${className}`.trim()}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePreview();
      }}
    >
      <section
        ref={dialogRef}
        className="arca-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={preview.subtitle ? descriptionId : undefined}
        tabIndex={-1}
        data-kind={preview.kind || 'image'}
      >
        <header className="arca-preview-header">
          <div className="arca-preview-heading">
            <span className="arca-preview-kicker">
              {lang === 'fr' ? 'ASSET IA A.R.C.A.' : 'A.R.C.A. AI ASSET'}
            </span>
            <h2 id={titleId}>{preview.title || (lang === 'fr' ? 'Previsualisation IA' : 'AI preview')}</h2>
            {preview.subtitle && <p id={descriptionId}>{preview.subtitle}</p>}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="btn-retro arca-preview-close"
            onClick={closePreview}
            aria-label={closeLabel}
            title={closeLabel}
          >
            {lang === 'fr' ? 'FERMER' : 'CLOSE'}
          </button>
        </header>

        <div
          className={`arca-preview-content ${isGallery ? 'is-gallery' : 'is-single'}`}
          role="document"
          tabIndex={0}
          aria-label={lang === 'fr' ? 'Images de la prévisualisation' : 'Preview images'}
        >
          {assets.map(asset => (
            <figure className="arca-preview-figure" key={asset.id}>
              {asset.label && <figcaption>{asset.label}</figcaption>}
              {failedAssets.has(asset.id) ? (
                <div className="arca-preview-error" role="status">
                  {lang === 'fr'
                    ? 'Image IA inaccessible pour cet asset.'
                    : 'AI image unavailable for this asset.'}
                </div>
              ) : (
                <img
                  src={asset.src}
                  alt={asset.alt}
                  onError={() => markAssetFailed(asset.id)}
                  className={pixelated ? 'is-pixelated' : ''}
                />
              )}
            </figure>
          ))}
        </div>
      </section>
    </div>,
    document.body
  );
}
