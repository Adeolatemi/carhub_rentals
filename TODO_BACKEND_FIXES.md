# Backend Bug Fixes - Updated Progress

**Key Issue Fixed:** 404 on /auth/login → Proxy in vite.config.js correct. Start backend server!

## Steps Completed:
- [x] TODO.md updated
- [x] .env.example created
- [x] Fixed server/src/routes/users.ts (uncomment KycHistory, add kyc fields)
- [x] Fixed server/src/routes/admin.ts (bcryptjs → bcrypt)

## Next Steps:
1. **Start backend:** In VSCode terminal: `cd server` then `npm run dev` 
   - Should see `Server listening on http://localhost:5000`
2. **Test frontend:** Refresh page, login should work (proxied)
3. **Run smoke test:** `cd server && node scripts/smokeTest.js`
4. **Build test:** `cd server && npm run build && npm start`
5. Remove legacy `server/routes/*.js`
6. Backend deployment (Vercel/Render)

Run step 1 now!

