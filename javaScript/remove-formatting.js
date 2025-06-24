import fs from 'fs';
import path from 'path';

const fileName = process.argv[2];

// 读取Markdown文件
const mdContent = fs.readFileSync(path.join('docs/posts/', fileName), 'utf8');

// 移除所有font标签
const cleanedContent = mdContent.replace(/<font[\s\S]*?>([\s\S]*?)<\/font>/g, '$1');

// 写入新文件
fs.writeFileSync(path.join('docs/posts/', fileName), cleanedContent, 'utf8');
console.log('处理完成！');