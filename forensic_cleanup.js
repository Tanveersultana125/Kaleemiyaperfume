const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'AdminDashboard.tsx');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// The lines were 867 to 903. Since it's zero-indexed: 866 to 902.
// We keep the RevenueVelocity call at 866 (index 865).
// So delete from 866 (index 866) to 902 (index 902).

lines.splice(866, 902 - 866 + 1);

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Forensic Cleanup Successful');
