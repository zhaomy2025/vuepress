import fs from 'fs';

fs.readFileSync('tmp/tmp.md', 'utf8', (err, data) => {
    if (err) throw err;
    const lines = data.split('\n');
    lines.sort();
    console.log(lines);
    const format_content = lines.join('\n');
    console.log(format_content);
    fs.writeFileSync('tmp/tmp.md', format_content);
})
