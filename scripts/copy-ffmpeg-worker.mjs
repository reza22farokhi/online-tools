import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = resolve('node_modules/@ffmpeg/ffmpeg/dist/esm');
const destination = resolve('public/vendor/ffmpeg/0.12.15');

await mkdir(destination, { recursive: true });
for (const file of ['worker.js', 'const.js', 'errors.js']) {
  await copyFile(resolve(source, file), resolve(destination, file));
}
console.log('Prepared same-origin FFmpeg worker assets.');
