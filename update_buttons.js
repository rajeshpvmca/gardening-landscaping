const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'dashboard');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const scriptToAppend = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('button, a.btn, .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.top.location.href = '../404.html';
            });
        });
    });
</script>
</body>`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('window.top.location.href')) {
        content = content.replace('</body>', scriptToAppend);
        fs.writeFileSync(filePath, content);
    }
}
console.log('Updated all dashboard files.');
