
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles, Globe, Server, UserCheck, Search, Command,
    Cpu, Shield, Rocket, Network, Database
} from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden min-h-screen flex items-center justify-center bg-black">
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl py-32 sm:py-48 lg:py-56 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                            Introducing the Universal Agent <a href="#" className="font-semibold text-indigo-400"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></a>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 animate-text">
                        Build Your Digital Empire <br /> with Just One Prompt.
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                        The world's first AI-native platform for automated hosting, cloud orchestration, and universal intelligence.
                        Deploy apps, secure domains, and access global data instantly.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="#"
                            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ring-1 ring-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all hover:scale-105"
                        >
                            Start for Free
                        </a>
                        <a href="#" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors">
                            Live Demo <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </motion.div>

                {/* Terminal / Single Prompt UI */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-16 mx-auto w-full max-w-3xl"
                >
                    <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl ring-1 ring-white/10">
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 ring-1 ring-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 ring-1 ring-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 ring-1 ring-green-500/50"></div>
                            </div>
                            <span className="text-xs text-gray-500 font-mono ml-2">agent@ksfoundation:~/workspace</span>
                        </div>
                        <div className="p-6 text-left font-mono text-sm leading-relaxed">
                            <div className="flex gap-3 text-emerald-400 mb-2">
                                <span className="text-blue-400">➜</span>
                                <span>Deploy a Nextcloud instance on a free Google Server and block queries from China firewall.</span>
                            </div>
                            <div className="text-gray-400 space-y-1">
                                <p>⚡ Analyzing intent...</p>
                                <p className="text-indigo-400">✓ Detected: Hosting Provisioning + GCP Manager + Firewall Engine</p>
                                <p>☁️ Provisioning GCP Instance 'cloud-node-01' (e2-micro)... <span className="text-green-500">Done (34.12.10.55)</span></p>
                                <p>📦 Deploying Container 'nextcloud' via Docker... <span className="text-green-500">Done</span></p>
                                <p>🛡️ Applying geo-block rules to iptables... <span className="text-green-500">Done</span></p>
                                <p className="text-white mt-4">🚀 Your private cloud is ready: <span className="underline decoration-indigo-500 underline-offset-4">https://cloud.ksfoundation.space</span></p>
                            </div>
                            <div className="mt-4 flex gap-2 items-center">
                                <span className="text-blue-400">➜</span>
                                <div className="h-5 w-2 bg-gray-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
        </div>
    );
};

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    className?: string;
}

const FeatureCard = ({ title, description, icon: Icon, className }: FeatureCardProps) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`relative overflow-hidden rounded-2xl p-8 border border-white/5 bg-white/5 backdrop-blur-sm ${className}`}
    >
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl"></div>
        <div className="relative z-10">
            <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 ring-1 ring-white/10">
                <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

const BentoGrid = () => {
    return (
        <div className="bg-black py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-indigo-400">Everything you need</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        A Platform that Defies Gravity.
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-400">
                        From students to enterprises, generate complete infrastructures with single commands.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                    {/* Large Card */}
                    <FeatureCard
                        title="Universal Intelligence"
                        description="Query businesses, social graphs, and identity records across Google, Meta, and Truecaller with our unified Data Layer."
                        icon={Globe}
                        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-900/20 to-black"
                    />
                    <FeatureCard
                        title="One-Click Cloud"
                        description="Deploy Nextcloud, WordPress, or Custom Apps instantly."
                        icon={Rocket}
                        className="md:col-span-1 md:row-span-1"
                    />
                    <FeatureCard
                        title="Polyglot Logic"
                        description="Host Python, Node, Java, PHP, and SAP workloads seamlessly."
                        icon={Cpu}
                        className="md:col-span-1 md:row-span-1"
                    />
                    <FeatureCard
                        title="Auto-Firewall"
                        description="AI-driven security rules that adapt to threats in real-time."
                        icon={Shield}
                        className="md:col-span-1 md:row-span-1"
                    />
                    <FeatureCard
                        title="K3s Orchestration"
                        description="Lightweight Kubernetes clusters that run anywhere, even on Edge."
                        icon={Network}
                        className="md:col-span-1 md:row-span-1"
                    />
                    <FeatureCard
                        title="Free Tier GCP"
                        description="We auto-provision Google Cloud Free Tier for eligible students and NGOs."
                        icon={Server}
                        className="md:col-span-1 md:row-span-1"
                    />
                </div>
            </div>
        </div>
    );
}

export default function MarketingPage() {
    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-indigo-500/30">
            <Hero />
            <BentoGrid />

            {/* Footer */}
            <footer className="border-t border-white/5 bg-black py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 flex justify-between items-center">
                    <p className="text-xs text-gray-500">© 2026 KSFoundation. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
