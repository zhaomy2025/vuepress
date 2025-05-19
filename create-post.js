import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const tmpFilePath = process.argv[2].toLowerCase();
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
const relativeFilePath = tmpFilePath.endsWith('/') ? `${tmpFilePath}index.md` : `${tmpFilePath}.md`;
const absoluteFilePath = path.join(__dirname, 'docs/posts/',relativeFilePath);
const dirPath = path.dirname(absoluteFilePath);
fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) {
        console.error('创建目录失败:', err);
        return;
    }
    console.log('目录创建成功');
});

fs.writeFileSync(absoluteFilePath, content);
console.log(`Created: ${relativeFilePath}`);