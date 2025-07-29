import fsPromise from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';

process.chdir('../src');

let helperDirs = [
	'codemirror',
	'dom',
	'global',
	'obsidian'
];

for (let i = 0; i < helperDirs.length; i++) {
	let curDir = helperDirs[i],
		dirents = await fsPromise.readdir(curDir, { recursive: true, withFileTypes: true });

	dirents = dirents.filter(dirent => dirent.isFile() && path.extname(dirent.name) == '.ts');

	let exportDecls = dirents.map(dirent => `export * from './${dirent.parentPath}/${path.basename(dirent.name, '.ts')}'`),
		indexContent = exportDecls.join('\n');

	await fsPromise.writeFile(`./${curDir}.ts`, indexContent);
}