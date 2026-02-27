const fs = require('fs');
const files = [
    'f:/scholarship/frontend/src/pages/AdminDashboard.jsx',
    'f:/scholarship/frontend/src/pages/VerifierDashboard.jsx'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/\\\`/g, '\`');
        content = content.replace(/\\\$/g, '$');
        fs.writeFileSync(file, content);
        console.log(`Fixed ${file}`);
    } catch (e) {
        console.error(`Error fixing ${file}:`, e);
    }
});
