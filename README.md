## Getting Started

First, run the development server:

1. Install dependencies

```bash
npm install
```

2. Start the local database container

```
docker compose up -d
```

3. Initial configuration

```bash
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npx prisma db pull (in case manual changes)
npx prisma generate (sync)
```

3. First deploy

```bash
npx prisma migrate deploy
npx prisma db seed
```

3. Deploy new migrations (update db) (Optional)

```bash
npx prisma migrate reset
npx prisma migrate deploy
```

4. If you modify to the prisma.schema:

```bash
npx prisma migrate dev -n add_new_columns
npx prisma generate
```

4. Run dev

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Access to
   http://localhost:3010/api/docs

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

ConfigurarURL en Supabase Dashboard → Authentication → URL Configuration
Site URL:
http://localhost:3010  -> URL final
