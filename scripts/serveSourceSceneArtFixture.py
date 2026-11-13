"""Serve the native QA build and exact Git-index media on loopback.

Sparse checkouts are supported without generating replacements. Only ordinary
bitmap/font bytes are read from the index; LFS pointers fail explicitly.
This server is test-only and is not a production media delivery mechanism.
"""
import argparse
from functools import lru_cache
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import mimetypes
from pathlib import Path, PurePosixPath
import re
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
ASSET = re.compile(r'^/(?:favicon\.png$|(?:backgrounds|sprites|fonts|images|boosters|oc-worlds|models)/)')
DLC_ASSET = re.compile(r'^/DLC/[^/]+/assets/')


def index_media():
    result = {}
    raw = subprocess.check_output(['git', 'ls-files', '--stage', '-z'], cwd=ROOT)
    for row in raw.split(b'\0'):
        if not row:
            continue
        meta, name = row.split(b'\t', 1)
        _, oid, stage = meta.split()
        if stage != b'0':
            continue
        name = name.decode()
        match = re.match(r'^DLC/[^/]+/assets/(.+)$', name)
        url = '/' + match[1] if match else '/' + name[7:] if name.startswith('public/') else None
        if url and (ASSET.match(url) or DLC_ASSET.match(url)):
            prior = result.get(url)
            if prior and prior[0] != name:
                raise ValueError(f'Ambiguous asset source for {url}: {prior[0]} / {name}')
            result[url] = (name, oid.decode())
            result['/' + name] = (name, oid.decode())
    return result


@lru_cache(maxsize=64)
def blob(oid):
    data = subprocess.check_output(['git', 'cat-file', 'blob', oid], cwd=ROOT)
    if data.startswith(b'version https://git-lfs.github.com/spec/v1\n'):
        raise ValueError('Unmaterialized Git LFS pointer: fetch original media rather than regenerate it')
    return data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=4177)
    parser.add_argument('--build-dir', default='.tmp/source-scene-art')
    args = parser.parse_args()
    build = (ROOT / args.build_dir).resolve()
    media = index_media()

    class Handler(SimpleHTTPRequestHandler):
        def do_GET(self):
            url = unquote(urlsplit(self.path).path)
            if any(part in ('.', '..') for part in PurePosixPath(url).parts) or '\\' in url:
                self.send_error(400)
                return
            if url == '/favicon.ico':
                self.send_response(204)
                self.end_headers()
                return
            is_asset = ASSET.match(url) or DLC_ASSET.match(url)
            if is_asset:
                candidates = [ROOT / ('public' + url)] if ASSET.match(url) else [ROOT / url.lstrip('/')]
                entry = media.get(url)
                if entry:
                    candidates.append(ROOT / entry[0])
                path = next((p for p in candidates if p.is_file() and not p.read_bytes()[:60].startswith(b'version https://git-lfs')), None)
                try:
                    data = path.read_bytes() if path else blob(entry[1]) if entry else None
                except (ValueError, subprocess.CalledProcessError) as exc:
                    self.send_error(424, str(exc))
                    return
                if data is None:
                    self.send_error(404, 'No exact checkout/index asset')
                    return
                self.send_response(200)
                self.send_header('Content-Type', mimetypes.guess_type(url)[0] or 'application/octet-stream')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
            path = (build / url.lstrip('/')).resolve()
            if build not in path.parents or not path.is_file():
                self.send_error(404)
                return
            data = path.read_bytes()
            self.send_response(200)
            self.send_header('Content-Type', mimetypes.guess_type(path)[0] or 'application/octet-stream')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)

    print(f'Native source-art QA: http://127.0.0.1:{args.port}/scripts/fixtures/source-scene-art.html', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()


if __name__ == '__main__':
    main()
