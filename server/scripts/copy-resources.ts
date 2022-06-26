
import * as shell from 'shelljs';
import * as fs from 'fs';
import * as path from 'path';

const out = path.join(__dirname, '..', 'dist');
createFolderIfNotExist(out);

createFolderIfNotExist(path.join(out, 'config'));

shell.cp('-R', 'src/config/*.yml', 'dist/config');
shell.cp('-R', 'src/*.conf', 'dist/');
shell.cp('-R', 'src/secrets/', 'dist/secrets/');
shell.cp('-R', 'src/*.json', 'dist/');

const clientDist = path.join(__dirname, '..', '..', 'frontend', 'target', 'classes');

if (fs.existsSync(clientDist)) {
  shell.cp('-R', clientDist, out);
}

function createFolderIfNotExist(outDir: string): void {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
}
