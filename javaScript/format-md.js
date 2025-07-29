import fs from 'fs';
import path from 'path';

const fileName = process.argv[2].includes('.md')? process.argv[2] : `${process.argv[2]}.md`;

// 读取Markdown文件
const mdContent = fs.readFileSync(path.join('docs/posts/', fileName), 'utf8');

// 移除所有font标签
var cleanedContent = mdContent.replace(/<font[\s\S]*?>([\s\S]*?)<\/font>/g, '$1');

// 移除所有粗体
cleanedContent = cleanedContent.replace(/\*\*/g, '');

// 移除标题中的序号
cleanedContent = cleanedContent.replace(/## \d+\.\d+\s/g, '## ');
cleanedContent = cleanedContent.replace(/## \d+\.\s/g, '## ');
cleanedContent = cleanedContent.replace(/## \(\d+\)\s/g, '## ');

// 标题行后面加空行
cleanedContent = cleanedContent.replace(/(##.*)/g, '$1\n');
cleanedContent = cleanedContent.replace(/\n\n\n/g, '\n\n');

// 写入新文件
fs.writeFileSync(path.join('docs/', fileName), cleanedContent, 'utf8');
console.log('处理完成！');