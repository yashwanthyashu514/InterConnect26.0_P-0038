const db = require('./db');
const bcrypt = require('bcrypt');

const caData = [
  { name: 'CA Rajesh Sharma', mrn: '102938', bio: 'Expert in GST and Audit.', fee: 5000, spec: 'GST' },
  { name: 'CA Anjali Gupta', mrn: '506782', bio: 'NRI taxation and FEMA specialis.', fee: 7500, spec: 'FEMA' },
  { name: 'CA Vikram Shah', mrn: '304921', bio: 'Crypto and Startup compliance.', fee: 4000, spec: 'Crypto Taxation' },
  { name: 'CA Meera Reddy', mrn: '882910', bio: 'Ex-Big4 Forensic Auditor.', fee: 12000, spec: 'Forensic Audit' },
  { name: 'CA Aditya Singh', mrn: '992182', bio: 'Certified RERA consultant.', fee: 6000, spec: 'RERA' }
];

async function inject() {
  console.log('🚀 Starting Elite CA Data Injection...');
  try {
    for (const ca of caData) {
      const email = `${ca.mrn}@maca.demo`;
      const passHash = await bcrypt.hash('DemoPass123!', 10);
      
      // 1. Insert User
      const userRes = await db.query(
        'INSERT INTO marketplace_users (email, password_hash, role, name) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name=$4 RETURNING id',
        [email, passHash, 'ca', ca.name]
      );
      const userId = userRes.rows[0].id;

      // 2. Insert Profile
      await db.query(`
        INSERT INTO ca_profiles 
        (user_id, icai_registration_no, kyc_status, bio, listed_price_paise, specialties) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (icai_registration_no) DO UPDATE SET bio=$4, listed_price_paise=$5`,
        [userId, ca.mrn, 'approved', ca.bio, ca.fee * 100, [ca.spec]]
      );
      console.log(`✅ Injected: ${ca.name} (MRN: ${ca.mrn})`);
    }
    console.log('🏁 Injection Complete! Your marketplace is now LIVE with elite data.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Injection Error:', err);
    process.exit(1);
  }
}

inject();
