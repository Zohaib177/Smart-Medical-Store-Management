const dotenv = require('dotenv');
dotenv.config();

const { pool } = require('../config/database');
const { hashPassword } = require('../services/passwordService');

async function seedAdmin() {
  const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@medicalstore.local';
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@1234';
  const fullName = process.env.DEFAULT_ADMIN_NAME || 'System Administrator';
  const phone = process.env.DEFAULT_ADMIN_PHONE || '0000000000';

  const hashedPassword = await hashPassword(password);
  const [rows] = await pool.execute('SELECT id FROM admins WHERE email = ? LIMIT 1', [email]);

  if (rows.length > 0) {
    await pool.execute('UPDATE admins SET password = ?, full_name = ?, phone = ?, status = ? WHERE email = ?', [hashedPassword, fullName, phone, 'active', email]);
    console.log('Admin seed updated');
    return;
  }

  await pool.execute('INSERT INTO admins (full_name, email, password, phone, status) VALUES (?, ?, ?, ?, ?)', [fullName, email, hashedPassword, phone, 'active']);
  console.log('Admin seed created');
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
