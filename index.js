#!/usr/bin/env node

import readline from 'readline';

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

// ─── Sleep ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Clear ───────────────────────────────────────────────────────────────────
const clear = () => process.stdout.write('\x1Bc');

// ─── ASCII Portrait ─────────────────────────────────────────────────────────
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

// ─── Section Data ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 1, icon: '📜', name: 'Bio', color: c.bCyan,
    content: () => `
  ${bold(c.bCyan, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
  ${bold(c.bYellow, '  📜  ABOUT ME')}
  ${bold(c.bCyan, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

  ${paint(c.bWhite, 'I am a passionate ')}${bold(c.bCyan, 'Full Stack Developer')}${paint(c.bWhite, ' currently working')}
  ${paint(c.bWhite, 'as a ')}${bold(c.bMagenta, 'Backend Developer')}${paint(c.bWhite, ' at ')}${bold(c.bYellow, 'SM TECHNOLOGY')}${paint(c.bWhite, ', Dhaka.')}

  ${paint(c.bWhite, 'I specialize in building scalable backend systems, secure REST')}
  ${paint(c.bWhite, 'APIs, and modern web apps using Node.js, Express.js, TypeScript,')}
  ${paint(c.bWhite, 'MongoDB, and PostgreSQL.')}

  ${paint(c.bGreen, '  ✦')} ${paint(c.white, '1+ year of professional experience')}
  ${paint(c.bGreen, '  ✦')} ${paint(c.white, 'Passionate about Backend Engineering')}
  ${paint(c.bGreen, '  ✦')} ${paint(c.white, 'Exploring Microservices & Docker')}
  ${paint(c.bGreen, '  ✦')} ${paint(c.white, 'Clean, maintainable code is my priority')}
  ${paint(c.bGreen, '  ✦')} ${paint(c.white, 'Always learning new technologies')}
  ${paint(c.bGreen, '  ✦')} ${paint(c.white, 'Open to collaboration and new opportunities')}
`,
  },
  {
    id: 2, icon: '🌟', name: 'Profession', color: c.bMagenta,
    content: () => `
  ${bold(c.bMagenta, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
  ${bold(c.bYellow, '  🌟  PROFESSION & ROLE')}
  ${bold(c.bMagenta, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

  ${bold(c.bCyan, '  Current Role:')}
  ${paint(c.bWhite, '  Backend Developer')}

  ${bold(c.bCyan, '  Company:')}
  ${paint(c.bYellow, '  SM TECHNOLOGY')}

  ${bold(c.bCyan, '  Location:')}
  ${paint(c.bWhite, '  Dhaka, Bangladesh 🇧🇩')}

  ${bold(c.bCyan, '  Tech Stack:')}
  ${paint(c.bBlack, '  Node.js • Express.js • TypeScript')}

  ${bold(c.bCyan, '  Focus Areas:')}
  ${paint(c.bMagenta, '  ▸')} ${paint(c.white, 'Backend Architecture & RESTful API Development')}
  ${paint(c.bMagenta, '  ▸')} ${paint(c.white, 'Database Design (MongoDB & PostgreSQL)')}
  ${paint(c.bMagenta, '  ▸')} ${paint(c.white, 'Authentication & Authorization')}
  ${paint(c.bMagenta, '  ▸')} ${paint(c.white, 'Payment Integration')}
  ${paint(c.bMagenta, '  ▸')} ${paint(c.white, 'Production Deployment')}

  ${bold(c.bCyan, '  Experience Level:')}
  ${paint(c.bWhite, '  ████████████████░░  ')}${bold(c.bYellow, '80%')}${paint(c.bBlack, '  — Growing Fast 🚀')}
`,
  },
  {
    id: 3, icon: '🛠', name: 'Skills', color: c.bGreen,
    content: () => `
  ${bold(c.bGreen, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
  ${bold(c.bYellow, '  🛠  TECHNICAL SKILLS')}
  ${bold(c.bGreen, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

  ${bold(c.bCyan, '  🎨 Frontend')}
  ${paint(c.bGreen, '  ❯')} HTML5, CSS3, JavaScript (ES6+), TypeScript
  ${paint(c.bGreen, '  ❯')} React.js, Next.js, Redux, Zustand
  ${paint(c.bGreen, '  ❯')} Tailwind CSS, Framer Motion, Sass

  ${bold(c.bBlue, '  ⚙️  Backend')}
  ${paint(c.bBlue, '  ❯')} Node.js, Express.js, Bun.js
  ${paint(c.bBlue, '  ❯')} MongoDB, Mongoose, Prisma ORM
  ${paint(c.bBlue, '  ❯')} PostgreSQL, REST APIs, GraphQL

  ${bold(c.bMagenta, '  🔧 Dev Tools')}
  ${paint(c.bMagenta, '  ❯')} Git, GitHub, VS Code, Postman
  ${paint(c.bMagenta, '  ❯')} Firebase, Vercel, Netlify, Railway
  ${paint(c.bMagenta, '  ❯')} Docker (learning), CI/CD pipelines

  ${bold(c.bYellow, '  📊 Proficiency')}
  ${paint(c.white, '  React.js  ')}${paint(c.bGreen, '██████████████░░')}${bold(c.bYellow, '  90%')}
  ${paint(c.white, '  Node.js   ')}${paint(c.bGreen, '████████████░░░░')}${bold(c.bYellow, '  80%')}
  ${paint(c.white, '  TypeScript')}${paint(c.bGreen, '███████████░░░░░')}${bold(c.bYellow, '  75%')}
  ${paint(c.white, '  PostgreSQL ')}${paint(c.bGreen, '█████████░░░░░░░')}${bold(c.bYellow, '  65%')}
`,
  },
  {
    id: 4, icon: '💡', name: 'Interests', color: c.bYellow,
    content: () => `
  ${bold(c.bYellow, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
  ${bold(c.bYellow, '  💡  INTERESTS & PASSIONS')}
  ${bold(c.bYellow, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

  ${bold(c.bCyan, '  🏗  Architecture & Engineering')}
  ${paint(c.yellow, '  ◆')} ${paint(c.white, 'Modern Web Architecture & Micro-frontends')}
  ${paint(c.yellow, '  ◆')} ${paint(c.white, 'System Design & Scalability patterns')}
  ${paint(c.yellow, '  ◆')} ${paint(c.white, 'Clean Code & SOLID Principles')}

  ${bold(c.bGreen, '  🚀  Performance & Quality')}
  ${paint(c.bGreen, '  ◆')} ${paint(c.white, 'Core Web Vitals & SEO Optimization')}
  ${paint(c.bGreen, '  ◆')} ${paint(c.white, 'Accessibility (a11y) & Inclusive Design')}
  ${paint(c.bGreen, '  ◆')} ${paint(c.white, 'Code Reviews & Best Practices')}

  ${bold(c.bMagenta, '  🌍  Community & Growth')}
  ${paint(c.bMagenta, '  ◆')} ${paint(c.white, 'Open Source Contribution')}
  ${paint(c.bMagenta, '  ◆')} ${paint(c.white, 'Tech Community Mentoring')}
  ${paint(c.bMagenta, '  ◆')} ${paint(c.white, 'Blogging & Knowledge Sharing')}

  ${bold(c.bBlue, '  🎯  Future Goals')}
  ${paint(c.bBlue, '  ◆')} ${paint(c.white, 'Contribute to major open source projects')}
  ${paint(c.bBlue, '  ◆')} ${paint(c.white, 'Master cloud infrastructure & DevOps')}
  ${paint(c.bBlue, '  ◆')} ${paint(c.white, 'Build a SaaS product from 0 → 1')}
`,
  },
  {
    id: 5, icon: '🌐', name: 'Connect', color: c.bBlue,
    content: () => `
  ${bold(c.bBlue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
  ${bold(c.bYellow, '  🌐  CONNECT WITH ME')}
  ${bold(c.bBlue, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

  ${bold(c.bCyan, '  🔗  Portfolio')}
  ${paint(c.bWhite, '      https://nayeem-miah.vercel.app')}

  ${bold(c.bBlack, '  🐙  GitHub')}
  ${paint(c.bWhite, '      https://github.com/nayeem-miah')}

  ${bold(c.bBlue, '  💼  LinkedIn')}
  ${paint(c.bWhite, '      https://www.linkedin.com/in/md-nayeem-miah-734719307')}

  ${bold(c.bRed, '  ✉️   Email')}
  ${paint(c.bWhite, '      nayeem5113a@gmail.com')}

  ${paint(c.bBlack, '  ─────────────────────────────────────────────────────')}
  ${paint(c.bGreen, '  💬')} ${paint(c.bWhite, 'Open to freelance, full-time roles, and collaborations!')}
  ${paint(c.bGreen, '  📩')} ${paint(c.white, 'Feel free to drop a message — I reply fast ⚡')}
`,
  },
  {
    id: 6, icon: '💼', name: 'Experience', color: c.bYellow,
    content: () => `
  ${bold(c.bYellow, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
  ${bold(c.bYellow, '  💼  WORK EXPERIENCE')}
  ${bold(c.bYellow, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

  ${bold(c.bCyan, '  🏢  Current Company:')}
  ${paint(c.bYellow, '      SM TECHNOLOGY')}

  ${bold(c.bCyan, '  💻  Position:')}
  ${paint(c.bWhite, '      Backend Developer')}

  ${bold(c.bCyan, '  ⏱️   Experience:')}
  ${paint(c.bGreen, '      1+ Year')}

  ${bold(c.bCyan, '  📍  Location:')}
  ${paint(c.bWhite, '      Dhaka, Bangladesh')}

  ${bold(c.bCyan, '  🔨  Responsibilities:')}
  ${paint(c.bYellow, '  ▸')} ${paint(c.white, 'Develop scalable REST APIs')}
  ${paint(c.bYellow, '  ▸')} ${paint(c.white, 'Design & Optimize Databases')}
  ${paint(c.bYellow, '  ▸')} ${paint(c.white, 'Authentication & Authorization (JWT)')}
  ${paint(c.bYellow, '  ▸')} ${paint(c.white, 'Payment Gateway Integration (Stripe, SSLCommerz)')}
  ${paint(c.bYellow, '  ▸')} ${paint(c.white, 'Bug Fixing & Feature Development')}
  ${paint(c.bYellow, '  ▸')} ${paint(c.white, 'API Performance Optimization')}
  ${paint(c.bYellow, '  ▸')} ${paint(c.white, 'Production Deployment')}
  ${paint(c.bYellow, '  ▸')} ${paint(c.white, 'Code Reviews & Maintenance')}
`,
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

// ─── Name Card below image ───────────────────────────────────────────────────
function printNameCard() {
  console.log(`
  ${bold(c.bBlue, '╔══════════════════════════════════════════════╗')}
  ${bold(c.bBlue, '║')}   ${bold(c.bWhite, '👤  MD NAYEEM MIAH')}                          ${bold(c.bBlue, '║')}
  ${bold(c.bBlue, '║')}   ${paint(c.bCyan, '💻  Full Stack Developer')}                    ${bold(c.bBlue, '║')}
  ${bold(c.bBlue, '║')}   ${paint(c.bBlack, '📍  Bangladesh')}  ${paint(c.bBlack, '|')}  ${paint(c.bGreen, '🟢 Open to work')}         ${bold(c.bBlue, '║')}
  ${bold(c.bBlue, '╚══════════════════════════════════════════════╝')}`);
}

// ─── Menu ────────────────────────────────────────────────────────────────────
function showMenu() {
  console.log(`
${bold(c.bYellow, '  ╔══════════════════════════════════════════════════════════╗')}
${bold(c.bYellow, '  ║')}  ${bold(c.bWhite, '📂  EXPLORE MY PROFILE  —  Select a section below')}   ${bold(c.bYellow, '║')}
${bold(c.bYellow, '  ╚══════════════════════════════════════════════════════════╝')}
`);
  SECTIONS.forEach((s) => {
    console.log(`  ${bold(s.color, `[${s.id}]`)}  ${paint(s.color, s.icon)}  ${bold(c.bWhite, s.name)}`);
  });
  console.log(`\n  ${bold(c.bBlack, '[0]')}  ${paint(c.bBlack, '❌')}  ${paint(c.bBlack, 'Exit')}`);
  console.log();
}

// ─── Main ────────────────────────────────────────────────────────────────────
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
  await sleep(300);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  const prompt = (q) => new Promise((resolve) => rl.question(q, resolve));

  let running = true;

  while (running) {
    showMenu();

    const answer = await prompt(
      `  ${bold(c.bCyan, '▶')}  ${paint(c.bWhite, 'Enter section number')} ${paint(c.bBlack, '(or 0 to exit)')} ${bold(c.bCyan, ':')} `
    );

    const choice = parseInt(answer.trim(), 10);

    if (choice === 0) {
      running = false;
      break;
    }

    const section = SECTIONS.find((s) => s.id === choice);

    if (section) {
      clear();
      console.log(section.content());
      console.log(
        `\n  ${paint(c.bBlack, 'Press')} ${bold(c.bCyan, 'Enter')} ${paint(c.bBlack, 'to go back...')}`
      );
      await prompt('');
      clear();
      printBanner();
    } else {
      console.log(
        `\n  ${paint(c.bRed, `✗  Invalid choice. Enter 1–${SECTIONS.length} or 0 to exit.`)}\n`
      );
      await sleep(900);
    }
  }

  rl.close();

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
