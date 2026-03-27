# Fix 500 Errors on /api/users/me and /api/auth/login

## Plan Steps:
- [ ] 1. Update server/prisma/schema.prisma - Add kycStatus and kycFile to User model
- [ ] 2. Fix server/src/middleware/auth.ts - payload.sub → payload.id
- [ ] 3. Fix server/src/routes/users.ts - Standardize middleware import to \"../middleware/auth\" {authenticate}, update router.get(\"/me\", authenticate)
- [ ] 4. Create server/.env with JWT_SECRET and DATABASE_URL
- [ ] 5. Prisma sync: cd server && npx prisma db push && npx prisma generate
- [ ] 6. Install deps if needed: cd server && npm install
- [ ] 7. Start server: cd server && npm run dev
- [ ] 8. Test endpoints (login, users/me) and verify frontend no 500s

## Status: Starting step 1
