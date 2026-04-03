const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'AdminDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /<div className="absolute top-0 right-0 w-64 h-64 bg\[#B0843D\].*?<\/div>              <\/div>/s;
content = content.replace(targetRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleanup Successful');
