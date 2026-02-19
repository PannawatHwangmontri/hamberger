/**
 * generate-seed.js
 * สร้าง seed.sql สำหรับ admin user (admin / admin1234)
 * รันด้วย: node generate-seed.js
 */
const bcrypt = require('bcryptjs');
const fs = require('fs');

const hash = bcrypt.hashSync('admin1234', 10);
const sql = `INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', '${hash}');\n`;

fs.writeFileSync('seed.sql', sql);
console.log('✅ Created seed.sql');
console.log('   Hash:', hash);
console.log('\n📋 Next step:');
console.log('   npx wrangler d1 execute hamberger-db --remote --file=seed.sql');
