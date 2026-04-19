# CA Marketplace — IDfy ICAI Auto-Verification Backend

This backend handles CA registration with immediate auto-verification using the IDfy ICAI API.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt
- **API**: Axios for IDfy calls

## Setup

1. **Database**:
   Run the SQL commands in `setup.sql` on your PostgreSQL database to create the required tables.

2. **Environment Variables**:
   Update the `.env` file with your credentials:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A secure string for signing tokens.
   - `IDFY_API_KEY`: Your IDfy API key.
   - `IDFY_BASE_URL`: Usually `https://api.idfy.com/verification/v3/icai`.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Server**:
   ```bash
   npm run dev
   ```

## API Routes

### 1. POST `/api/marketplace/auth/register-ca`
Registers a CA and performs auto-verification.
**Body:**
```json
{
  "email": "ca@example.com",
  "password": "securepassword",
  "full_name": "JOHN DOE",
  "icai_membership_number": "123456",
  "city": "Mumbai",
  "specialization": "Audit",
  "experience_years": 5
}
```

### 2. POST `/api/marketplace/auth/login`
**Body:**
```json
{
  "email": "ca@example.com",
  "password": "securepassword"
}
```

## Verification Logic
The system automatically verifies the CA based on:
1. `status` is 'ACTIVE' in ICAI records.
2. `name` matches the provided full name (case-insensitive).
3. `cop_validity` is in the future.

The full IDfy API response is saved in the `idfy_raw_response` column for auditing purposes.
