# DevLog

A full-stack developer blogging platform built with Next.js 15, Prisma, and Neon PostgreSQL. Developers can write, publish, and like posts.

---

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Database** — PostgreSQL via [Neon](https://neon.tech)
- **ORM** — Prisma 7 with `@prisma/adapter-neon`
- **Auth** — NextAuth.js v5 (Credentials provider)
- **Styling** — Tailwind CSS
- **Notifications** — react-hot-toast
- **Deployment** — Vercel (recommended)

---

## Features

- Register and login with email/password
- Create, publish, unpublish, and delete posts
- Tag posts (comma separated)
- Like/unlike posts
- Dashboard showing only your own posts
- Explore page showing all tags
- Toast notifications for all actions
- Responsive dark UI

---

## Project Structure

```
devlog/
├── actions/
│   ├── auth.ts          # registerUser Server Action
│   └── posts.ts         # createPost, deletePost, togglePublish, toggleLike
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   └── posts/
│   │       ├── route.ts                  # GET, POST
│   │       └── [id]/route.ts             # GET, PUT, DELETE
│   ├── components/
│   │   ├── post-card.tsx                 # Like button (client)
│   │   ├── post-actions.tsx              # Publish/Delete (client)
│   │   ├── session-provider.tsx          # NextAuth SessionProvider
│   │   └── navbar.tsx
│   ├── dashboard/page.tsx                # SSR — user posts
│   ├── explore/page.tsx                  # ISR — tags
│   ├── login/page.tsx                    # Login form
│   ├── register/page.tsx                 # Register form
│   ├── posts/
│   │   ├── new/page.tsx                  # Create post
│   │   └── [slug]/page.tsx               # SSR — single post
│   ├── layout.tsx                        # Root layout + Navbar + Footer
│   └── page.tsx                          # ISR — home feed
├── auth.ts              # NextAuth config
├── lib/
│   └── db.ts            # Prisma client singleton (Neon adapter)
└── prisma/
    └── schema.prisma    # DB models
```

---

## Routes / Pages

| Route | Type | Rendering |
|---|---|---|
| `/` | Home feed | ISR (revalidate: 30s) |
| `/explore` | Browse tags | ISR (revalidate: 60s) |
| `/posts/[slug]` | Single post | SSR |
| `/dashboard` | Your posts | SSR |
| `/posts/new` | Create post | SSR (auth-gated) |
| `/login` | Login | Static |
| `/register` | Register | Static |

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/posts` | Fetch all posts |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts/[id]` | Fetch single post by ID |
| PUT | `/api/posts/[id]` | Update a post |
| DELETE | `/api/posts/[id]` | Delete a post |

---

## Server Actions

| Action | File | Use Case |
|---|---|---|
| `registerUser` | `actions/auth.ts` | Register form submission |
| `createPost` | `actions/posts.ts` | New post form submission |
| `deletePost` | `actions/posts.ts` | Dashboard quick-delete |
| `togglePublish` | `actions/posts.ts` | Publish / unpublish from dashboard |
| `toggleLike` | `actions/posts.ts` | Like / unlike a post |

**API Routes vs Server Actions:** API routes are used for standard REST operations consumable by any client. Server Actions are used for form submissions and UI-triggered mutations — they are colocated with the component that needs them and work without client-side JavaScript.

---

## Rendering Strategies

| Strategy | Where Used | Why |
|---|---|---|
| **SSG** | `/login`, `/register` | Static pages, no dynamic data |
| **ISR** | `/` (revalidate: 30s) | Post feed changes occasionally, full SSR not needed |
| **ISR** | `/explore` (revalidate: 60s) | Tag stats change slowly |
| **SSR** | `/posts/[slug]` | Fresh like count and content on every visit |
| **SSR** | `/dashboard` | User-specific data, must be request-time |
| **SSR** | `/posts/new` | Auth check required at request time |

---

## Database Schema

Four models: `User`, `Post`, `Tag`, `Like`

- A `User` has many `Post`s and many `Like`s
- A `Post` has many `Tag`s (many-to-many) and many `Like`s
- A `Like` links a `User` to a `Post` (unique constraint prevents duplicate likes)

---

## Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET="your-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
```

See `.env.example` for reference.

---

## How to Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/devlog.git
cd devlog
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
# .env mein apni DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL daalo
```

**4. Push DB schema and generate Prisma client**
```bash
npx prisma db push
npx prisma generate
```

**5. Run the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Setup

1. [Neon](https://neon.tech) pe free account banao
2. Naya project banao
3. Dashboard se connection string copy karo
4. `.env` mein `DATABASE_URL` mein paste karo
5. `npx prisma db push` run karo — sab tables ban jaayengi

---

## Concepts Covered (from class)

- [x] Next.js App Router setup
- [x] File-based routing
- [x] Layouts (RootLayout)
- [x] Multiple pages and routes
- [x] Server Side Rendering (SSR)
- [x] Static Site Generation (SSG)
- [x] Incremental Static Regeneration (ISR)
- [x] API Routes — GET, POST, PUT, DELETE
- [x] Structured API responses with `success` flag
- [x] Proper error handling in all routes
- [x] Database connection via Prisma + Neon PostgreSQL
- [x] Full CRUD operations
- [x] Server Actions with `"use server"` directive
- [x] Clear distinction between API Routes and Server Actions
- [x] Environment variables for secrets
- [x] Authentication with NextAuth.js

---

## Assumptions and Limitations

- No email verification on register
- No image upload support for posts (text only)
- No pagination on home feed (shows latest posts)
- Authentication uses JWT strategy (no database sessions)