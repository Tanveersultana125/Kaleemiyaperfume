const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    content = content.replace(/import\s+Header\s+from\s+['"][^'"]*Header['"];?\n?/g, '');
    content = content.replace(/import\s+Footer\s+from\s+['"][^'"]*Footer['"];?\n?/g, '');

    content = content.replace(/\s*<Header[^>]*\/>\n?/g, '\n');
    content = content.replace(/\s*<Footer[^>]*\/>\n?/g, '\n');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned ${file}`);
    }
}
