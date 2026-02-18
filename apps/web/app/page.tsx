"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Trophy, Zap, Terminal } from "lucide-react";
import CountUp from "react-countup";

export default function LandingPage() {
  return (
    /* Changed: px-4 for mobile, px-6 for desktop */
    <div className="space-y-16 md:space-y-24 bg-black px-4 md:px-6 pb-10 pt-6 md:pt-10 text-zinc-200">
      <Hero />
      <div className="mx-auto max-w-6xl space-y-24">
        <Features />
        <HowItWorks />
        <SocialProof />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}

function Hero() {
  const demoXP = 1200;
  const level = Math.floor(demoXP / 500) + 1;

  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-6 md:p-16">
      <Glow />

      <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge />

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-white md:text-6xl">
            Level up your
            <span className="block text-emerald-400">
              Web3 journey
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base md:text-lg text-zinc-400 leading-relaxed">
            Complete on-chain quests, earn XP, and collect soulbound badges. A
            gamified reputation layer for the decentralized internet.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <PrimaryButton href="/dashboard">Enter App</PrimaryButton>
            <SecondaryButton href="/leaderboard">
              View Leaderboard
            </SecondaryButton>
          </div>

          <Stats />
        </div>

        <HeroCard xp={demoXP} level={level} />
      </div>
    </section>
  );
}

function Glow() {
  return (
    <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium tracking-tight text-zinc-400">
      <Terminal size={14} className="text-emerald-500" />
      v1.0.0 — Sepolia Testnet
    </div>
  );
}

function Stats() {
  const items = [
    { label: "Network", value: "Sepolia" },
    { label: "Actions", value: "TX & Sign" },
    { label: "Data", value: "IPFS" },
  ];

  return (
    <div className="mt-10 flex gap-6 md:gap-10 border-t border-zinc-800/50 pt-8 text-sm">
      {items.map((i) => (
        <div key={i.label}>
          <div className="font-bold text-white text-sm md:text-base">{i.value}</div>
          <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-tighter">{i.label}</div>
        </div>
      ))}
    </div>
  );
}

function HeroCard({ xp, level }: { xp: number; level: number }) {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-[2rem] bg-linear-to-r from-emerald-500/20 to-violet-500/20 blur-2xl opacity-50" />
      <div className="relative rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Explorer</div>
            <div className="font-mono text-sm md:text-lg font-medium text-white">0xAbC...1234</div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/10 px-3 py-2 md:px-4">
            <div className="text-lg md:text-xl">⚡</div>
            <div>
              <div className="text-[10px] md:text-xs font-black italic text-white uppercase leading-none">Level {level}</div>
              <div className="mt-1 text-[10px] font-bold text-emerald-400 leading-none">
                <CountUp end={xp} duration={2} separator="," /> XP
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <QuestRow title="Verify On-Chain ID" xp="+500" done />
          <QuestRow title="Swap on Uniswap" xp="+200" done />
          <QuestRow title="Mint Genesis Badge" xp="+300" />
        </div>
      </div>
    </div>
  );
}

function QuestRow({ title, xp, done }: any) {
  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
      done ? "border-emerald-500/20 bg-emerald-500/5" : "border-zinc-800 bg-zinc-950"
    }`}>
      <div className={`text-sm font-medium ${done ? "text-emerald-100" : "text-zinc-400"}`}>{title}</div>
      <div className={`text-xs font-bold ${done ? "text-emerald-400" : "text-zinc-600"}`}>
        {done ? "COMPLETE ✓" : xp}
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: <Zap className="text-emerald-400" size={28} />,
      title: "On-chain Quests",
      desc: "Complete real blockchain actions and prove participation with verifiable data.",
    },
    {
      icon: <Trophy className="text-violet-400" size={28} />,
      title: "XP & Leaderboards",
      desc: "Climb global rankings and showcase your on-chain reputation.",
    },
    {
      icon: <ShieldCheck className="text-blue-400" size={28} />,
      title: "Soulbound Badges",
      desc: "Earn non-transferable NFTs that represent your achievements forever.",
    },
  ];

  return (
    <section className="space-y-12">
      <SectionHeader
        title="Built for explorers"
        subtitle="Everything you need to gamify your Web3 journey"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-emerald-500/40 hover:bg-zinc-900"
          >
            <div className="mb-6 inline-block rounded-2xl bg-zinc-950 p-3 border border-zinc-800 group-hover:border-emerald-500/20 transition-colors">
              {f.icon}
            </div>
            <div className="text-xl font-bold text-white">{f.title}</div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    "Connect your wallet",
    "Complete quests",
    "Earn XP & badges",
    "Climb the leaderboard",
  ];

  return (
    /* Changed: p-8 for mobile, grid-cols-2 for tablet, grid-cols-4 for desktop */
    <section className="rounded-3xl md:rounded-[2.5rem] border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-8 md:p-12">
      <SectionHeader
        title="How it works"
        subtitle="Simple, transparent, and fully on-chain"
      />

      <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s} className="relative text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-black border border-emerald-500/20">
              {i + 1}
            </div>
            <div className="text-xs md:text-sm font-semibold text-zinc-300 uppercase tracking-wide">{s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="text-center space-y-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">Built with modern Web3 stack</p>
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 font-mono text-sm text-zinc-500">
        <span className="hover:text-zinc-300 transition">Next.js</span>
        <span className="hover:text-zinc-300 transition">Wagmi</span>
        <span className="hover:text-zinc-300 transition">Viem</span>
        <span className="hover:text-zinc-300 transition">NestJS</span>
        <span className="hover:text-zinc-300 transition">Prisma</span>
      </div>
    </section>
  );
}

function CTA() {
  return (
    /* Changed: p-8 for mobile, p-16 for desktop */
    <section className="rounded-3xl md:rounded-[2.5rem] border border-zinc-800 bg-linear-to-r from-emerald-500/5 via-violet-500/5 to-emerald-500/5 p-8 md:p-16 text-center">
      <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
        Start your on-chain adventure
      </h3>
      <p className="mx-auto mt-4 max-w-md text-sm md:text-base text-zinc-400">
        Connect your wallet and begin earning verifiable reputation that moves with you across the metaverse.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <PrimaryButton href="/dashboard">Launch App</PrimaryButton>
        <SecondaryButton href="/leaderboard">
          Explore Rankings
        </SecondaryButton>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pt-10 text-center text-xs font-medium tracking-widest text-zinc-600 uppercase">
      QuestFi &copy; 2026 • Open-source Web3 experiment
    </footer>
  );
}

function SectionHeader({ title, subtitle }: any) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
      <p className="mt-2 text-zinc-400">{subtitle}</p>
    </div>
  );
}

function PrimaryButton({ href, children }: any) {
  return (
    <Link
      href={href}
      /* Changed: w-full on mobile, w-auto on sm+ */
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-black hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
    >
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}

function SecondaryButton({ href, children }: any) {
  return (
    <Link
      href={href}
      /* Changed: w-full on mobile, w-auto on sm+ */
      className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900/50 px-8 py-4 font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all w-full sm:w-auto"
    >
      {children}
    </Link>
  );
}