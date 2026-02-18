# QuestFi 🎯

> **Web3 questing made Web2-simple.** Complete quests, earn XP, climb leaderboards, and collect NFT/SBT badges — all in a few clicks.

🔴 **Live App** → [questfi.niladri.app](https://questfi.niladri.app)  
💻 **Built as Project 1/6 of my [6 Projects in 60 Days](https://twitter.com/dev_niladri) challenge**

---

## What is QuestFi?

QuestFi is a Web3 dApp that makes onchain interactions feel native and intuitive. The idea is simple: connect your wallet, pick a quest, complete it, earn XP, and mint a badge. No jargon, no friction — just progress you can see.

Under the hood, it's a production-grade fullstack application that proves Web3 dApps still need real backends.

---

## Features

- **Quest System** — Browse and complete onchain quests
- **XP & Leveling** — Earn experience points tracked off-chain with full consistency
- **Leaderboard** — Compete with other users in real time
- **NFT/SBT Badges** — Mint soulbound or transferable badge rewards on quest completion
- **Web3 Auth** — Wallet-based authentication via RainbowKit
- **Event-driven Architecture** — Blockchain events trigger backend jobs via BullMQ queues

---

## Tech Stack

### Monorepo
- **[Turborepo](https://turbo.build/)** — Monorepo build system

### Frontend (`apps/web`)
- **[Next.js](https://nextjs.org/)** — React framework
- **[RainbowKit](https://www.rainbowkit.com/)** — Wallet connection UI
- **[Wagmi](https://wagmi.sh/)** — React hooks for Ethereum
- **[Viem](https://viem.sh/)** — TypeScript Ethereum library

### Backend (`apps/api`)
- **[NestJS](https://nestjs.com/)** — Modular Node.js framework
- **[Prisma](https://www.prisma.io/)** — Type-safe ORM
- **[BullMQ](https://bullmq.io/)** — Queue system for async jobs
- **[Redis](https://redis.io/)** — Queue broker + caching

### Infrastructure
- **[AWS EC2](https://aws.amazon.com/ec2/)** — Backend hosting (nginx + PM2)
- **[Vercel](https://vercel.com/)** — Frontend hosting

---

## Architecture

```
QuestFi/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── ui/           # Shared UI components
│   └── config/       # Shared configs (eslint, tsconfig)
└── turbo.json
```

The blockchain handles **ownership and trust**. The backend handles everything else — XP logic, leaderboard rankings, quest state tracking, and onchain event listening via BullMQ workers.

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Redis (local or hosted)
- A wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

```bash
git clone https://github.com/niladri-gudu/QuestFi.git
cd QuestFi
pnpm install
```

### Environment Setup

Create `.env` files in both `apps/web` and `apps/api`. Refer to the `.env.example` files in each directory.

```bash
# apps/api
DATABASE_URL=
REDIS_URL=
RPC_URL=
PRIVATE_KEY=

# apps/web
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

### Run Locally

```bash
pnpm dev
```

This starts both the Next.js frontend and NestJS backend in parallel via Turborepo.

---

## Deployment

- **Frontend** — Deployed to Vercel via GitHub integration
- **Backend** — Deployed to AWS EC2 with nginx as a reverse proxy and PM2 as the process manager

---

## What I Learned

This was Project 1 of my 6 Projects in 60 Days challenge. Key takeaways:

- Web3 dApps **still need real backends** — blockchain is for trust, not application logic
- Deploying a Node.js server on EC2 from scratch (SSH, nginx, PM2, env management)
- BullMQ + Redis is a clean solution for handling async blockchain event processing
- Turborepo makes fullstack monorepo DX genuinely good

---

## Roadmap

- [ ] More quest types (social, onchain activity, protocol interactions)
- [ ] Guild / team quests
- [ ] Multi-chain support
- [ ] Quest creation UI for protocols to publish their own quests

---

## Author

**Niladri** — [@dev_niladri](https://twitter.com/dev_niladri)

Follow along as I go from Web2 → Web3 in real time. 5 more projects to go.

---

## License

MIT
