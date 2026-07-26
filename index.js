#!/usr/bin/env node

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const MESSAGES_FILE = path.join(__dirname, 'messages.txt');

// ─── Inbox Password (SHA-256 hash) ───────────────────────────────────────────
// Password is stored as SHA-256 hash (password not visible in source code)
// To change password: run → node -e "import('crypto').then(m => console.log(m.default.createHash('sha256').update('YOUR_NEW_PASSWORD').digest('hex')))"
// Then replace the hash string below with the new hash
const INBOX_PASSWORD_HASH = 'a4f262998222bc693fdf925db93e651c01eba777abeade2a0770b5b0ca91b0aa';

// ─── ANSI Color Helpers ──────────────────────────────────────────────────────
const c = {
  reset:    '\x1b[0m',
  bold:     '\x1b[1m',
  dim:      '\x1b[2m',
  black:    '\x1b[30m',
  red:      '\x1b[31m',
  green:    '\x1b[32m',
  yellow:   '\x1b[33m',
  blue:     '\x1b[34m',
  magenta:  '\x1b[35m',
  cyan:     '\x1b[36m',
  white:    '\x1b[37m',
  bBlack:   '\x1b[90m',
  bRed:     '\x1b[91m',
  bGreen:   '\x1b[92m',
  bYellow:  '\x1b[93m',
  bBlue:    '\x1b[94m',
  bMagenta: '\x1b[95m',
  bCyan:    '\x1b[96m',
  bWhite:   '\x1b[97m',
  bgBlue:   '\x1b[44m',
};

const paint = (color, text) => `${color}${text}${c.reset}`;
const bold  = (color, text) => `${c.bold}${color}${text}${c.reset}`;

// ─── Sleep / Clear ───────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const clear = () => process.stdout.write('\x1Bc');

// ─── ASCII Portrait ──────────────────────────────────────────────────────────
const PORTRAIT = `
${paint(c.bCyan, '                    ██████████████                    ')}
${paint(c.bCyan, '                ████')}${paint(c.yellow, '░░░░░░░░░░░░░░░░')}${paint(c.bCyan, '████                ')}
${paint(c.bCyan, '              ██')}${paint(c.yellow, '░░░░')}${paint(c.bWhite, '██████████████████')}${paint(c.yellow, '░░░░')}${paint(c.bCyan, '██              ')}
${paint(c.bCyan, '            ██')}${paint(c.yellow, '░░')}${paint(c.bWhite, '████')}${paint(c.bBlack, '▓▓')}${paint(c.bWhite, '████████████')}${paint(c.bBlack, '▓▓')}${paint(c.bWhite, '████')}${paint(c.yellow, '░░')}${paint(c.bCyan, '██            ')}
${paint(c.bCyan, '            ██')}${paint(c.yellow, '░░')}${paint(c.bWhite, '██')}${paint(c.bBlack, '▓▓▓▓')}${paint(c.bWhite, '████████████')}${paint(c.bBlack, '▓▓▓▓')}${paint(c.bWhite, '██')}${paint(c.yellow, '░░')}${paint(c.bCyan, '██            ')}
${paint(c.bCyan, '            ██')}${paint(c.yellow, '░░░░')}${paint(c.bWhite, '████████████████████')}${paint(c.yellow, '░░░░')}${paint(c.bCyan, '██            ')}
${paint(c.bCyan, '              ██')}${paint(c.bWhite, '░░')}${paint(c.yellow, '▄▄▄▄')}${paint(c.bWhite, '░░░░░░░░░░░░')}${paint(c.yellow, '▄▄▄▄')}${paint(c.bWhite, '░░')}${paint(c.bCyan, '██              ')}
${paint(c.bCyan, '              ██')}${paint(c.bWhite, '░░░░░░░░░░░░░░░░░░░░░░')}${paint(c.bCyan, '██              ')}
${paint(c.bCyan, '                ██')}${paint(c.bWhite, '░░░░░░████░░░░░░')}${paint(c.bCyan, '████              ')}
${paint(c.bCyan, '                  ████')}${paint(c.yellow, '░░░░░░░░')}${paint(c.bCyan, '████                ')}
${paint(c.bCyan, '                      ████████████                      ')}`;

// ─── Projects Data ───────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: 'TalkNative – English Practice Platform',
    description:
      'Built an English learning platform with random partner matching, real-time\n  messaging, Stripe payments, and an LMS for managing users, courses, lessons,\n  and enrollments.',
    clientCode:  'https://github.com/nayeem-miah/TalkNative-English-Practice-Platform',
    serverCode:  'https://github.com/nayeem-miah/TalkNative-English-Practice-Platform-api',
    liveLink:    'https://talk-native-english-practice-platfo.vercel.app',
    tech: ['Next.js 16', 'Tailwind CSS', 'Redux', 'Express.js', 'Prisma ORM', 'Socket.io', 'MongoDB', 'Stripe'],
  },
  {
    id: 2,
    title: 'Parcel Delivery System',
    description:
      'A secure and role-based Parcel Delivery system for Senders, Receivers,\n  and Admins to manage parcels seamlessly.',
    clientCode: 'https://github.com/nayeem-miah/parcel-delvey-client',
    serverCode: 'https://github.com/nayeem-miah/parcel-delvey-api',
    liveLink:   'https://parcel-delevary-client.vercel.app',
    tech: ['TypeScript', 'React.js', 'Redux Toolkit', 'RTK Query', 'Node.js', 'Express.js', 'MongoDB'],
  },
  {
    id: 3,
    title: 'Quick Buzz E-Commerce',
    description:
      'A high-performance e-commerce platform tailored for the local market with\n  integrated payment gateways and smooth UX.',
    clientCode: 'https://github.com/nayeem-miah/quick-buzz-E-Commare-Team',
    serverCode: 'https://github.com/nayeem-miah/quick-buzz-E-Commare-Team',
    liveLink:   'https://quick-bus-bd.web.app/',
    tech: ['TypeScript', 'React.js', 'Node.js', 'Express.js', 'Firebase', 'MongoDB'],
  },
];

// ─── Section Content Generators ───────────────────────────────────────────────
function generateProjectsContent() {
  const div = paint(c.bBlack, '  ' + '─'.repeat(60));
  const hdiv = paint(c.bBlack, '\n  ' + '─'.repeat(60) + '\n');
  let out = `\n  ${bold(c.bYellow, '─── [ 🚀 SELECTED PROJECTS ] ──────────────────────────────────────────')}\n`;

  PROJECTS.forEach((p, idx) => {
    out += `
  ${bold(c.bCyan, `#${p.id}`)}  ${bold(c.bWhite, p.title)}
  ${div}
  ${paint(c.bWhite, p.description)}

  ${paint(c.bBlack, '  •')} ${bold(c.bMagenta, 'Tech Stack:')} ${paint(c.bWhite, p.tech.join(' • '))}

  ${bold(c.bBlue, '    Client :')} ${paint(c.bCyan, p.clientCode)}
  ${bold(c.bBlue, '    Server :')} ${paint(c.bCyan, p.serverCode)}
  ${bold(c.bGreen, '    Live   :')} ${bold(c.bGreen, p.liveLink)}`;
    if (idx < PROJECTS.length - 1) out += hdiv;
  });

  return out;
}

function generateEducationContent() {
  return `
  ${bold(c.bYellow, '─── [ 🎓 EDUCATION & BACKGROUND ] ────────────────────────────────────')}

  ${bold(c.bCyan, '  Moulvibazar Polytechnic Institute')}
  ${paint(c.bWhite, '  Diploma in Engineering')}
  ${paint(c.bMagenta, '  Department: Computer Science & Technology (CST)')}
  ${paint(c.bBlack, '  Duration  : 2022 – 2026')}
  ${paint(c.bGreen, '  CGPA      : 3.39 / 4.00')}

  ${paint(c.bBlack, '  ' + '─'.repeat(58))}

  ${bold(c.bCyan, '  Shahgonj High School and College')}
  ${paint(c.bWhite, '  SSC (Secondary School Certificate)')}
  ${paint(c.bMagenta, '  Group: Science')}
  ${paint(c.bBlack, '  Year  : 2021')}
  ${paint(c.bGreen, '  GPA   : 4.33 / 5.00')}

  ${paint(c.bBlack, '  ' + '─'.repeat(58))}

  ${bold(c.bMagenta, '  Self-Learning & Professional Courses')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Complete Web Development  —  Programming Hero')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Advanced TypeScript & JavaScript')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Backend Engineering: Node.js, Express, Prisma')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Database Design: MongoDB & PostgreSQL')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Microservices & Docker')}
`;
}

// ─── Section Data ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 1, icon: '📜', name: 'Bio', color: c.bCyan,
    content: () => `
  ${bold(c.bCyan, '─── [ 📜 ABOUT ME ] ──────────────────────────────────────────────────')}

  ${paint(c.bWhite, 'I am a passionate ')}${bold(c.bCyan, 'Full Stack Developer')}${paint(c.bWhite, ' currently working')}
  ${paint(c.bWhite, 'as a ')}${bold(c.bMagenta, 'Backend Developer')}${paint(c.bWhite, ' at ')}${bold(c.bYellow, 'SM TECHNOLOGY')}${paint(c.bWhite, ', Dhaka.')}

  ${paint(c.bWhite, 'I specialize in building scalable backend systems, secure REST')}
  ${paint(c.bWhite, 'APIs, and modern web apps using Node.js, Express.js, TypeScript,')}
  ${paint(c.bWhite, 'MongoDB, and PostgreSQL.')}

  ${paint(c.bGreen, '  •')} ${paint(c.white, '1+ year of professional engineering experience')}
  ${paint(c.bGreen, '  •')} ${paint(c.white, 'Focused on scalable backend architecture & security')}
  ${paint(c.bGreen, '  •')} ${paint(c.white, 'Exploring Microservices, Docker & Cloud Infrastructure')}
  ${paint(c.bGreen, '  •')} ${paint(c.white, 'Prioritizing clean, maintainable & self-documenting code')}
  ${paint(c.bGreen, '  •')} ${paint(c.white, 'Open to global remote opportunities & technical collaborations')}
`,
  },
  {
    id: 2, icon: '🌟', name: 'Profession', color: c.bMagenta,
    content: () => `
  ${bold(c.bMagenta, '─── [ 🌟 PROFESSION & ROLE ] ──────────────────────────────────────────')}

  ${bold(c.bCyan, '  Current Role :')} ${paint(c.bWhite, 'Backend Developer')}
  ${bold(c.bCyan, '  Company      :')} ${paint(c.bYellow, 'SM TECHNOLOGY')}
  ${bold(c.bCyan, '  Location     :')} ${paint(c.bWhite, 'Dhaka, Bangladesh')}
  ${bold(c.bCyan, '  Tech Stack   :')} ${paint(c.bBlack, 'Node.js • Express.js • TypeScript')}

  ${bold(c.bCyan, '  Core Focus Areas:')}
  ${paint(c.bMagenta, '  •')} ${paint(c.white, 'Backend Architecture & RESTful API Development')}
  ${paint(c.bMagenta, '  •')} ${paint(c.white, 'Database Design (MongoDB & PostgreSQL)')}
  ${paint(c.bMagenta, '  •')} ${paint(c.white, 'Authentication & Authorization (JWT, OAuth)')}
  ${paint(c.bMagenta, '  •')} ${paint(c.white, 'Payment Gateways & Webhooks')}
  ${paint(c.bMagenta, '  •')} ${paint(c.white, 'Production Deployment & Server Management')}

  ${bold(c.bCyan, '  Proficiency  :')} ${paint(c.bWhite, '████████████████░░  ')}${bold(c.bYellow, '80%')}
`,
  },
  {
    id: 3, icon: '🛠', name: 'Skills', color: c.bGreen,
    content: () => `
  ${bold(c.bGreen, '─── [ 🛠 TECHNICAL SKILLS ] ──────────────────────────────────────────')}

  ${bold(c.bCyan, '  Frontend')}
  ${paint(c.bGreen, '  •')} HTML5, CSS3, JavaScript (ES6+), TypeScript
  ${paint(c.bGreen, '  •')} React.js, Next.js, Redux, Zustand
  ${paint(c.bGreen, '  •')} Tailwind CSS, Framer Motion, Sass

  ${bold(c.bBlue, '  Backend')}
  ${paint(c.bBlue, '  •')} Node.js, Express.js, Bun.js
  ${paint(c.bBlue, '  •')} MongoDB, Mongoose, Prisma ORM
  ${paint(c.bBlue, '  •')} PostgreSQL, REST APIs, GraphQL

  ${bold(c.bMagenta, '  Dev Tools & Cloud')}
  ${paint(c.bMagenta, '  •')} Git, GitHub, VS Code, Postman
  ${paint(c.bMagenta, '  •')} Firebase, Vercel, Netlify, Railway
  ${paint(c.bMagenta, '  •')} Docker, CI/CD pipelines

  ${bold(c.bYellow, '  Proficiency Breakdown')}
  ${paint(c.white, '  React.js   ')}${paint(c.bGreen, '██████████████░░')}${bold(c.bYellow, '  90%')}
  ${paint(c.white, '  Node.js    ')}${paint(c.bGreen, '████████████░░░░')}${bold(c.bYellow, '  80%')}
  ${paint(c.white, '  TypeScript ')}${paint(c.bGreen, '███████████░░░░░')}${bold(c.bYellow, '  75%')}
  ${paint(c.white, '  PostgreSQL ')}${paint(c.bGreen, '█████████░░░░░░░')}${bold(c.bYellow, '  65%')}
`,
  },
  {
    id: 4, icon: '💡', name: 'Interests', color: c.bYellow,
    content: () => `
  ${bold(c.bYellow, '─── [ 💡 INTERESTS & PASSIONS ] ───────────────────────────────────────')}

  ${bold(c.bCyan, '  Architecture & Engineering')}
  ${paint(c.yellow, '  •')} ${paint(c.white, 'Modern Web Architecture & Micro-services')}
  ${paint(c.yellow, '  •')} ${paint(c.white, 'System Design & Scalability Patterns')}
  ${paint(c.yellow, '  •')} ${paint(c.white, 'Clean Code & SOLID Principles')}

  ${bold(c.bGreen, '  Performance & Quality')}
  ${paint(c.bGreen, '  •')} ${paint(c.white, 'Core Web Vitals & API Latency Optimization')}
  ${paint(c.bGreen, '  •')} ${paint(c.white, 'Accessibility (a11y) & UX Polish')}
  ${paint(c.bGreen, '  •')} ${paint(c.white, 'Code Reviews & Engineering Standards')}

  ${bold(c.bMagenta, '  Community & Future Goals')}
  ${paint(c.bMagenta, '  •')} ${paint(c.white, 'Open Source Contribution')}
  ${paint(c.bMagenta, '  •')} ${paint(c.white, 'Mastering Cloud Infrastructure & DevOps')}
  ${paint(c.bMagenta, '  •')} ${paint(c.white, 'Building scalable SaaS products from 0 → 1')}
`,
  },
  {
    id: 5, icon: '🌐', name: 'Connect', color: c.bBlue,
    content: () => `
  ${bold(c.bBlue, '─── [ 🌐 CONNECT WITH ME ] ───────────────────────────────────────────')}

  ${bold(c.bCyan, '  Portfolio :')} ${paint(c.bWhite, 'https://nayeem-miah.vercel.app')}
  ${bold(c.bCyan, '  GitHub    :')} ${paint(c.bWhite, 'https://github.com/nayeem-miah')}
  ${bold(c.bCyan, '  LinkedIn  :')} ${paint(c.bWhite, 'https://www.linkedin.com/in/md-nayeem-miah-734719307')}
  ${bold(c.bCyan, '  Email     :')} ${paint(c.bWhite, 'nayeem5113a@gmail.com')}

  ${paint(c.bBlack, '  ─────────────────────────────────────────────────────────────')}
  ${paint(c.bGreen, '  •')} ${paint(c.bWhite, 'Open for freelance, full-time engineering roles & collaborations.')}
  ${paint(c.bGreen, '  •')} ${paint(c.white, 'Feel free to reach out — I usually reply promptly.')}
`,
  },
  {
    id: 6, icon: '💼', name: 'Experience', color: c.bYellow,
    content: () => `
  ${bold(c.bYellow, '─── [ 💼 WORK EXPERIENCE ] ────────────────────────────────────────────')}

  ${bold(c.bCyan, '  Company   :')} ${paint(c.bYellow, 'SM TECHNOLOGY')}
  ${bold(c.bCyan, '  Role      :')} ${paint(c.bWhite, 'Backend Developer')}
  ${bold(c.bCyan, '  Duration  :')} ${paint(c.bGreen, '1+ Year')}
  ${bold(c.bCyan, '  Location  :')} ${paint(c.bWhite, 'Dhaka, Bangladesh')}

  ${bold(c.bCyan, '  Responsibilities:')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Architecting & Developing Scalable REST APIs')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Designing & Optimizing MongoDB & PostgreSQL Schemas')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Implementing Robust Auth (JWT, Role-based Access Control)')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Integrating Payment Gateways (Stripe, SSLCommerz)')}
  ${paint(c.bYellow, '  •')} ${paint(c.white, 'Optimizing API Performance & Handling Server Production Deployments')}
`,
  },
  {
    id: 7, icon: '🚀', name: 'Projects', color: c.bGreen,
    content: generateProjectsContent,
  },
  {
    id: 8, icon: '🎓', name: 'Education', color: c.bYellow,
    content: generateEducationContent,
  },
];

// ─── Typing Animation ────────────────────────────────────────────────────────
async function typeWrite(text, delay = 15) {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
  process.stdout.write('\n');
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
async function withSpinner(label, fn) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r  ${paint(c.bCyan, frames[i % frames.length])}  ${paint(c.bBlack, label)}`);
    i++;
  }, 80);
  const result = await fn();
  clearInterval(interval);
  process.stdout.write('\r' + ' '.repeat(label.length + 10) + '\r');
  return result;
}

// ─── Banner ──────────────────────────────────────────────────────────────────
function printBanner() {
  const line = paint(c.bCyan, '═'.repeat(62));
  console.log(`
${line}
${bold(c.bCyan,    '  ███╗   ██╗ █████╗ ██╗   ██╗███████╗███████╗███╗   ███╗')}
${bold(c.bCyan,    '  ████╗  ██║██╔══██╗╚██╗ ██╔╝██╔════╝██╔════╝████╗ ████║')}
${bold(c.bCyan,    '  ██╔██╗ ██║███████║ ╚████╔╝ █████╗  █████╗  ██╔████╔██║')}
${bold(c.bMagenta, '  ██║╚██╗██║██╔══██║  ╚██╔╝  ██╔══╝  ██╔══╝  ██║╚██╔╝██║')}
${bold(c.bMagenta, '  ██║ ╚████║██║  ██║   ██║   ███████╗███████╗██║ ╚═╝ ██║')}
${bold(c.bMagenta, '  ╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝     ╚═╝')}
${line}
${bold(c.bWhite,  "             👋  Hello! I'm MD Nayeem Miah")}
${paint(c.bBlack,  '          💻 Full Stack Developer  |  Tech Explorer')}
${line}`);
}

// ─── Name Card ───────────────────────────────────────────────────────────────
function printNameCard() {
  console.log(`
  ${bold(c.bBlue, '╔══════════════════════════════════════════════╗')}
  ${bold(c.bBlue, '║')}   ${bold(c.bWhite, '👤  MD NAYEEM MIAH')}                          ${bold(c.bBlue, '║')}
  ${bold(c.bBlue, '║')}   ${paint(c.bCyan, '💻  Full Stack Developer')}                    ${bold(c.bBlue, '║')}
  ${bold(c.bBlue, '║')}   ${paint(c.bBlack, '📍  Bangladesh')}  ${paint(c.bBlack, '|')}  ${paint(c.bGreen, '🟢 Open to work')}         ${bold(c.bBlue, '║')}
  ${bold(c.bBlue, '╚══════════════════════════════════════════════╝')}`);
}

// ─── Raw Mode Helpers ────────────────────────────────────────────────────────
function enableRawMode() {
  if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
}

function disableRawMode() {
  if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(false);
  }
  process.stdin.pause();
}

function readKey() {
  return new Promise(resolve => {
    process.stdin.once('data', resolve);
  });
}

// ─── Menu Renderer ────────────────────────────────────────────────────────────
function renderMenu(selectedIdx, hint = '') {
  console.log(`
${bold(c.bYellow, '  ╔══════════════════════════════════════════════════════════╗')}
${bold(c.bYellow, '  ║')}  ${bold(c.bWhite, '📂  EXPLORE MY PROFILE  —  Select a section below')}   ${bold(c.bYellow, '║')}
${bold(c.bYellow, '  ╚══════════════════════════════════════════════════════════╝')}
`);

  SECTIONS.forEach((s, idx) => {
    if (idx === selectedIdx) {
      console.log(
        `  ${bold(c.bYellow, '▶')} ${bold(s.color, `[${s.id}]`)}  ${s.icon}  ${bold(c.bYellow, s.name)}`
      );
    } else {
      console.log(
        `    ${paint(s.color, `[${s.id}]`)}  ${s.icon}  ${paint(c.bBlack, s.name)}`
      );
    }
  });

  console.log(`\n  ${paint(c.bBlack, '[0]')}  ❌  ${paint(c.bBlack, 'Exit')}`);

  if (hint) {
    console.log(`\n  ${paint(c.bRed, hint)}`);
  }

  console.log(`
  ${paint(c.bBlack, '─────────────────────────────────────────────────')}
  ${bold(c.bBlack, '  ↑ ↓')} ${paint(c.bBlack, 'navigate')}  ${bold(c.bBlack, 'Enter')} ${paint(c.bBlack, 'select')}  ${bold(c.bCyan, '/')} ${paint(c.bBlack, 'search')}  ${bold(c.bMagenta, 'c')} ${paint(c.bBlack, 'contact')}  ${bold(c.bYellow, 'm')} ${paint(c.bBlack, 'inbox')}  ${bold(c.bBlack, '0')} ${paint(c.bBlack, 'exit')}
`);
}

// ─── Show Section ────────────────────────────────────────────────────────────
async function showSection(section) {
  clear();
  console.log(section.content());
  console.log(
    `\n  ${paint(c.bBlack, '┌─────────────────────────────────┐')}`
  );
  console.log(
    `  ${paint(c.bBlack, '│')}  ${bold(c.bCyan, 'Press any key')} ${paint(c.bBlack, 'to go back...')}  ${paint(c.bBlack, '│')}`
  );
  console.log(
    `  ${paint(c.bBlack, '└─────────────────────────────────┘')}\n`
  );
  await readKey();
  clear();
  printBanner();
}

// ─── Search Mode ─────────────────────────────────────────────────────────────
async function searchMode() {
  let query = '';
  let filteredIdx = 0;

  while (true) {
    const filtered = SECTIONS.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    // clamp index
    if (filteredIdx >= filtered.length) filteredIdx = Math.max(0, filtered.length - 1);

    clear();
    printBanner();

    // Search bar
    console.log(`
  ${bold(c.bCyan, '╔══════════════════════════════════════════════════════════╗')}
  ${bold(c.bCyan, '║')}  ${paint(c.bYellow, '🔍 SEARCH:')}  ${bold(c.bWhite, query || ' ')}${paint(c.bBlack, '█')}${' '.repeat(Math.max(0, 42 - query.length))}${bold(c.bCyan, '║')}
  ${bold(c.bCyan, '╚══════════════════════════════════════════════════════════╝')}
`);

    if (query && filtered.length === 0) {
      console.log(`  ${paint(c.bRed, `  ✗ No sections found for "${query}"`)}\n`);
    } else {
      SECTIONS.forEach((s) => {
        const match = filtered.find(f => f.id === s.id);
        const isSelected = match && filtered.indexOf(match) === filteredIdx;
        if (match) {
          if (isSelected) {
            console.log(`  ${bold(c.bYellow, '▶')} ${bold(s.color, `[${s.id}]`)}  ${s.icon}  ${bold(c.bYellow, s.name)}`);
          } else {
            console.log(`    ${bold(s.color, `[${s.id}]`)}  ${s.icon}  ${paint(c.bWhite, s.name)}`);
          }
        } else {
          console.log(`    ${paint(c.bBlack, `[${s.id}]`)}  ${s.icon}  ${paint(c.bBlack, s.name)}`);
        }
      });
    }

    console.log(`\n  ${paint(c.bBlack, 'Esc')} ${paint(c.bBlack, 'cancel')}  •  ${paint(c.bBlack, '↑↓')} ${paint(c.bBlack, 'navigate')}  •  ${paint(c.bBlack, 'Enter')} ${paint(c.bBlack, 'open section')}`);

    const key = await readKey();

    if (key === '\x1b') {
      // Escape — cancel search
      return null;
    } else if (key === '\r' || key === '\n') {
      if (filtered.length > 0) {
        return filtered[filteredIdx];
      }
    } else if (key === '\x1b[A') {
      // Up arrow
      filteredIdx = Math.max(0, filteredIdx - 1);
    } else if (key === '\x1b[B') {
      // Down arrow
      filteredIdx = Math.min(filtered.length - 1, filteredIdx + 1);
    } else if (key === '\x7f' || key === '\b') {
      // Backspace
      query = query.slice(0, -1);
      filteredIdx = 0;
    } else if (key.length === 1 && key >= ' ') {
      query += key;
      filteredIdx = 0;
    }
  }
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
async function contactForm() {
  clear();

  // Temporarily disable raw mode for text input
  disableRawMode();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  const ask = (question) => new Promise(resolve => rl.question(question, resolve));

  console.log(`
  ${bold(c.bMagenta, '╔══════════════════════════════════════════════════════════╗')}
  ${bold(c.bMagenta, '║')}   ${bold(c.bYellow, '💬  CONTACT ME')}                                        ${bold(c.bMagenta, '║')}
  ${bold(c.bMagenta, '║')}   ${paint(c.bBlack, 'Your message will be saved to messages.txt')}             ${bold(c.bMagenta, '║')}
  ${bold(c.bMagenta, '╚══════════════════════════════════════════════════════════╝')}

  ${paint(c.bBlack, '  ──────────────────────────────────────────────────────────')}
`);

  const name    = await ask(`  ${bold(c.bCyan,    '  👤 Your Name    :')} `);
  const email   = await ask(`  ${bold(c.bYellow,  '  📧 Your Email   :')} `);
  const subject = await ask(`  ${bold(c.bMagenta, '  📌 Subject      :')} `);
  const message = await ask(`  ${bold(c.bGreen,   '  💬 Your Message :')} `);

  rl.close();

  const isEmpty = !name.trim() && !email.trim() && !message.trim();

  if (isEmpty) {
    console.log(`\n  ${paint(c.bRed, '✗  Cancelled — no data entered.')}\n`);
    await sleep(1200);
  } else {
    const timestamp = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });
    const divider = '━'.repeat(50);

    const entry = [
      '',
      divider,
      `📅 Date    : ${timestamp}`,
      `👤 Name    : ${name || '(not provided)'}`,
      `📧 Email   : ${email || '(not provided)'}`,
      `📌 Subject : ${subject || '(not provided)'}`,
      `💬 Message : ${message || '(not provided)'}`,
      divider,
      '',
    ].join('\n');

    try {
      fs.appendFileSync(MESSAGES_FILE, entry, 'utf8');

      console.log(`
  ${bold(c.bGreen, '╔══════════════════════════════════════════════════════════╗')}
  ${bold(c.bGreen, '║')}   ${paint(c.bGreen, '✓  Message saved successfully!')}                        ${bold(c.bGreen, '║')}
  ${bold(c.bGreen, '║')}   ${paint(c.bWhite, '📁 Saved to: messages.txt')}                             ${bold(c.bGreen, '║')}
  ${bold(c.bGreen, '║')}   ${paint(c.bBlack, "📬 I'll get back to you soon! ⚡")}                      ${bold(c.bGreen, '║')}
  ${bold(c.bGreen, '╚══════════════════════════════════════════════════════════╝')}
`);
    } catch {
      console.log(`\n  ${paint(c.bRed, '✗  Error saving message. Check file permissions.')}\n`);
    }

    await sleep(2000);
  }

  // Re-enable raw mode for menu navigation
  enableRawMode();
  clear();
  printBanner();
}

// ─── Masked Password Input ───────────────────────────────────────────────────
async function readMaskedPassword(prompt) {
  process.stdout.write(prompt);
  let password = '';

  while (true) {
    const key = await readKey();

    if (key === '\r' || key === '\n') {
      process.stdout.write('\n');
      return password;
    } else if (key === '\x03' || key === '\x1b') {
      // Ctrl+C or Escape → cancel
      process.stdout.write('\n');
      return null;
    } else if (key === '\x7f' || key === '\b') {
      // Backspace
      if (password.length > 0) {
        password = password.slice(0, -1);
        process.stdout.write('\b \b');
      }
    } else if (key.length === 1 && key >= ' ') {
      password += key;
      process.stdout.write(paint(c.bYellow, '*'));
    }
  }
}

// ─── Inbox Viewer (Password Protected) ───────────────────────────────────────
async function viewInbox() {
  const MAX_ATTEMPTS = 3;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    clear();
    const remaining = MAX_ATTEMPTS - attempts;

    console.log(`
  ${bold(c.bYellow, '╔══════════════════════════════════════════════════════════╗')}
  ${bold(c.bYellow, '║')}   ${bold(c.bWhite, '🔐  INBOX — PASSWORD REQUIRED')}                         ${bold(c.bYellow, '║')}
  ${bold(c.bYellow, '║')}   ${paint(c.bBlack, `Attempt ${attempts + 1} of ${MAX_ATTEMPTS}`)}                                          ${bold(c.bYellow, '║')}
  ${bold(c.bYellow, '╚══════════════════════════════════════════════════════════╝')}
`);

    const input = await readMaskedPassword(
      `  ${bold(c.bCyan, '🔑 Enter password:')} `
    );

    // Cancelled
    if (input === null) {
      clear();
      printBanner();
      return;
    }

    const inputHash = crypto.createHash('sha256').update(input).digest('hex');

    if (inputHash === INBOX_PASSWORD_HASH) {
      // ✅ Correct password — show messages
      clear();

      if (!fs.existsSync(MESSAGES_FILE)) {
        console.log(`
  ${bold(c.bYellow, '╔══════════════════════════════════════════════════════════╗')}
  ${bold(c.bYellow, '║')}   ${paint(c.bYellow, '📭  No messages yet!')}                                  ${bold(c.bYellow, '║')}
  ${bold(c.bYellow, '╚══════════════════════════════════════════════════════════╝')}
`);
        await sleep(1500);
        clear();
        printBanner();
        return;
      }

      const raw = fs.readFileSync(MESSAGES_FILE, 'utf8').trim();

      if (!raw) {
        console.log(`\n  ${paint(c.bYellow, '📭  No messages yet.')}\n`);
        await sleep(1500);
        clear();
        printBanner();
        return;
      }

      // Count messages (each block separated by divider)
      const msgCount = (raw.match(/━{10,}/g) || []).length / 2;

      console.log(`
  ${bold(c.bGreen, '╔══════════════════════════════════════════════════════════╗')}
  ${bold(c.bGreen, '║')}   ${bold(c.bYellow, '📬  INBOX')}  ${paint(c.bBlack, '—')}  ${paint(c.bWhite, `${Math.floor(msgCount)} message(s) received`)}               ${bold(c.bGreen, '║')}
  ${bold(c.bGreen, '╚══════════════════════════════════════════════════════════╝')}
`);

      // Pretty-print each line
      raw.split('\n').forEach(line => {
        if (line.startsWith('━')) {
          console.log(`  ${paint(c.bBlack, line)}`);
        } else if (line.startsWith('📅')) {
          console.log(`  ${bold(c.bBlack, line)}`);
        } else if (line.startsWith('👤')) {
          console.log(`  ${bold(c.bCyan, line)}`);
        } else if (line.startsWith('📧')) {
          console.log(`  ${paint(c.bBlue, line)}`);
        } else if (line.startsWith('📌')) {
          console.log(`  ${paint(c.bMagenta, line)}`);
        } else if (line.startsWith('💬')) {
          console.log(`  ${bold(c.bWhite, line)}`);
        } else {
          console.log(`  ${paint(c.bBlack, line)}`);
        }
      });

      console.log(`
  ${paint(c.bBlack, '┌─────────────────────────────────┐')}
  ${paint(c.bBlack, '│')}  ${bold(c.bCyan, 'Press any key')} ${paint(c.bBlack, 'to go back...')}  ${paint(c.bBlack, '│')}
  ${paint(c.bBlack, '└─────────────────────────────────┘')}
`);
      await readKey();
      clear();
      printBanner();
      return;
    }

    // ❌ Wrong password
    attempts++;
    if (attempts < MAX_ATTEMPTS) {
      console.log(`\n  ${paint(c.bRed, `✗  Wrong password! ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`)}\n`);
      await sleep(1200);
    }
  }

  // 🔒 Too many attempts
  clear();
  console.log(`
  ${bold(c.bRed, '╔══════════════════════════════════════════════════════════╗')}
  ${bold(c.bRed, '║')}   ${paint(c.bRed, '🔒  ACCESS LOCKED — Too many wrong attempts!')}          ${bold(c.bRed, '║')}
  ${bold(c.bRed, '║')}   ${paint(c.bBlack, 'Please restart the app and try again.')}                 ${bold(c.bRed, '║')}
  ${bold(c.bRed, '╚══════════════════════════════════════════════════════════╝')}
`);
  await sleep(2500);
  clear();
  printBanner();
}

// ─── Main Menu Loop ───────────────────────────────────────────────────────────
async function runMenu() {
  let selectedIdx = 0;
  let running = true;
  let hint = '';

  enableRawMode();

  while (running) {
    clear();
    printBanner();
    renderMenu(selectedIdx, hint);
    hint = '';

    const key = await readKey();

    if (key === '\x03') {
      // Ctrl + C → exit
      running = false;
    } else if (key === '0' || key === 'q' || key === 'Q') {
      running = false;
    } else if (key === '\x1b[A') {
      // Up arrow
      selectedIdx = (selectedIdx - 1 + SECTIONS.length) % SECTIONS.length;
    } else if (key === '\x1b[B') {
      // Down arrow
      selectedIdx = (selectedIdx + 1) % SECTIONS.length;
    } else if (key === '\r' || key === '\n') {
      // Enter → open highlighted section
      await showSection(SECTIONS[selectedIdx]);
    } else if (key === '/') {
      // Search mode
      const found = await searchMode();
      if (found) {
        selectedIdx = SECTIONS.findIndex(s => s.id === found.id);
        await showSection(found);
      }
      clear();
      printBanner();
    } else if (key === 'c' || key === 'C') {
      // Contact form
      await contactForm();
    } else if (key === 'm' || key === 'M') {
      // 🔐 Inbox viewer (password protected)
      await viewInbox();
    } else {
      // Number key direct jump (1-8)
      const num = parseInt(key, 10);
      if (!isNaN(num) && num >= 1 && num <= SECTIONS.length) {
        const section = SECTIONS.find(s => s.id === num);
        if (section) {
          selectedIdx = SECTIONS.indexOf(section);
          await showSection(section);
        }
      } else if (!isNaN(num) && key !== '0') {
        hint = `✗ Invalid choice. Press ↑↓ to navigate or 1–${SECTIONS.length}.`;
      }
    }
  }

  disableRawMode();
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  clear();

  // Show ASCII portrait
  console.log(PORTRAIT);

  printNameCard();
  await sleep(200);

  printBanner();
  await sleep(150);

  process.stdout.write(`\n  ${paint(c.bBlack, '»')} `);
  await typeWrite(
    paint(c.bGreen, '"Write clean code, design elegant UI, deliver impact."'),
    12
  );
  await sleep(400);

  // Run the interactive menu
  await runMenu();

  // Goodbye screen
  console.log(`
${bold(c.bCyan, '  ╔══════════════════════════════════════════════════════════╗')}
${bold(c.bCyan, '  ║')}   ${paint(c.bGreen, '✨  Thanks for exploring my profile!')}                  ${bold(c.bCyan, '║')}
${bold(c.bCyan, '  ║')}   ${paint(c.bWhite,  "   Let's build something amazing together. 🚀")}         ${bold(c.bCyan, '║')}
${bold(c.bCyan, '  ╚══════════════════════════════════════════════════════════╝')}

  ${paint(c.bBlack, '📧')} ${paint(c.bWhite, 'nayeem5113a@gmail.com')}   ${paint(c.bBlack, '🔗')} ${paint(c.bCyan, 'nayeem-miah.vercel.app')}
`);

  process.exit(0);
}

main().catch((err) => {
  console.error(paint(c.red, `\n  Error: ${err.message}\n`));
  process.exit(1);
});
