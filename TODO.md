# Deployment Bug Fixes TODO

**Status: All frontend deployment bugs fixed. Backend ready.**

## Fixed Deployment Issues:
- Backend scripts/.env/CORS ✓
- **GH Workflow**: Fixed publish_dir ./dist → ./docs (matches vite.config outDir)
- Images paths ✓ (`/images/...` + base=/carhub_rentals/)
- API: Uses VITE_API_URL (.env created)

## Remaining:
- [ ] Deploy backend (Render/Heroku)
- [ ] Set VITE_API_URL=your-backend-url in GH Pages Settings > Env vars

**Test**: `npm run deploy` or git push main (triggers workflow)



- [ ] 2. Fix server/package.json: Update 'start' script to 'node dist/index.js', add 'prod' script, remove duplicate bcryptjs
- [x] 3. Update server/src/app.ts: Add prod CORS origins (GH Pages)
- [ ] 4. cd server && npx prisma db push && npx prisma generate
- [ ] 5. cd server && npm install && npm run build && npm start (test no crashes)
- [ ] 6. Test APIs: login, /users/me (no 500s), Postman collection
- [ ] 7. Update frontend src/api/axios.js baseURL for prod (separate backend deploy)
- [ ] 8. Add backend deployment: New .github/workflows/backend-deploy.yml (e.g., Render) or instructions
- [ ] 9. Full test: Frontend deploy, backend running, E2E APIs

**Next:** Implement step 1 (create .env)

