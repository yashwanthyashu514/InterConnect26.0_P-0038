const db = require('./db');
async function clean() {
  try {
    // Delete the users I just injected
    await db.query("DELETE FROM marketplace_users WHERE email LIKE '%@maca.demo'");
    console.log('✅ Injected data removed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Clean error:', err);
    process.exit(1);
  }
}
clean();
