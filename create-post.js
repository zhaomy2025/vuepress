import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const tmpFilePath = process.argv[2].toLowerCase();
const filePath = tmpFilePath.endsWith('/') ? `${tmpFilePath}index.md` : `${tmpFilePath}.md`;
const title = process.argv[3];
const category = tmpFilePath.split('/');
if (!tmpFilePath.endsWith('/')){
    category.pop();
}
const content = `---
title: ${title}
date: ${new Date().toISOString()}
category:
` + category.map(c => `  - ${c}`).join('\n') + `
tags:
` + category.map(c => `  - ${c}`).join('\n') +`
---

# ${title}
[[toc]]
`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(__dirname, 'docs/posts/',filePath), content);
console.log(`Created: ${filePath}`);