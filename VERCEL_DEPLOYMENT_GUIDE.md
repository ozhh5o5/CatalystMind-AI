# Vercel Deployment Guide: Next.js + Prisma + SQLite

This guide summarizes the fixes implemented to resolve common Vercel deployment errors for the AI for Bharat hackathon projects.

## 1. Resolving Dependency Conflicts (`ERESOLVE`)
**Issue:** `npm install` fails on Vercel due to peer dependency mismatches (e.g., React 19 vs. @base-ui).
**Fix:**
- Create a `.npmrc` file in the project root with the following content:
  ```text
  legacy-peer-deps=true
  ```
- Align `package.json` versions to stable releases:
  ```json
  "next": "16.2.4",
  "react": "19.2.4",
  "react-dom": "19.2.4"
  ```

## 2. Fixing Database Connectivity (`P1012`)
**Issue:** `Environment variable not found: DATABASE_URL` during build.
**Fix:** Hardcode the SQLite path directly in `prisma/schema.prisma` to avoid needing Vercel environment variables for local/demo databases:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 3. Bundling the Database for Runtime
**Issue:** Deployment succeeds, but the front page shows a "Server Error" (Prisma can't find `dev.db` in the serverless environment).
**Fix:** 
1. Update `next.config.ts` to explicitly bundle the `prisma` folder:
   ```typescript
   const nextConfig = {
     serverExternalPackages: ["@prisma/client", "prisma"],
     outputFileTracingIncludes: {
       "/*": ["./prisma/**/*"],
     },
   };
   ```
2. Update `lib/db.ts` to use absolute paths via `process.cwd()`:
   ```typescript
   import path from "path";
   import { PrismaClient } from "@prisma/client"

   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

   export const prisma = globalForPrisma.prisma ?? new PrismaClient({
     datasources: {
       db: {
         url: `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`,
       },
     },
   })
   ```

## 4. Next.js 15+ Configuration Schema
**Issue:** Build fails with `Unrecognized key(s) in object: ... at "experimental"`.
**Fix:** Move keys out of `experimental` to the top level of `next.config.ts`:
- Change `experimental.serverComponentsExternalPackages` → `serverExternalPackages`.
- Change `experimental.outputFileTracingIncludes` → `outputFileTracingIncludes`.

## 5. Build Pipeline Optimization
**Issue:** Database is empty after deployment.
**Fix:** Ensure your `package.json` build script handles the full Prisma lifecycle:
```json
"scripts": {
  "build": "prisma generate && prisma db push --accept-data-loss && npm run seed && next build"
}
```
