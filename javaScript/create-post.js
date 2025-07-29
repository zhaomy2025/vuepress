import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const tmpFilePath = process.argv[2].toLowerCase();
const title = process.argv[3];
const category = tmpFilePath.split('/');
if (tmpFilePath.endsWith('/')){
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
const absoluteFilePath = path.join(__dirname, '/../docs/posts/',relativeFilePath);
const dirPath = path.dirname(absoluteFilePath);

console.log('准备创建目录',dirPath);

fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) {
        console.error('创建目录失败:', err);
        return;
    }
    console.log('目录创建成功');

    const index_path = path.join(dirPath, 'index.md');
    if(!fs.existsSync(index_path) && !tmpFilePath.endsWith('/') ){
        const dirName = dirPath.substring(dirPath.lastIndexOf('/') + 1);
        const parentTitle = dirName.substring(0, 1).toUpperCase()+dirName.substring(1)
        // index.md 文件内容
        const index_content = `---
title: ${parentTitle}
date: ${new Date().toISOString()}
category:
` + category.map(c => `  - ${c}`).join('\n') + `
tags:
` + category.map(c => `  - ${c}`).join('\n') +`
---

# ${parentTitle}
[[toc]]
`;

        fs.writeFileSync(path.join(dirPath, 'index.md'), index_content);

        console.log(`Created: ${path.join(dirPath, 'index.md')}`);
    }


    fs.writeFileSync(absoluteFilePath, content);
    console.log(`Created: ${relativeFilePath}`);
});

