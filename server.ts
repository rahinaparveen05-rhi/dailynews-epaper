import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { Request, Response } from 'express';

interface StoredUser {
  id: string;
  name: string;
  number: string;
  passwordHash: string;
  passwordSalt: string;
  language: 'en' | 'hi' | 'ta' | 'te';
  bookmarks: unknown[];
  createdAt: string;
}

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SECRET_FILE = path.join(DATA_DIR, '.auth_secret');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getAuthSecret(): string {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  ensureDataDir();
  if (fs.existsSync(SECRET_FILE)) {
    return fs.readFileSync(SECRET_FILE, 'utf8').trim();
  }
  const generated = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SECRET_FILE, generated, 'utf8');
  return generated;
}

function readUsers(): StoredUser[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function normalizePhoneNumber(input: string): string {
  return input.replace(/\D/g, '').slice(-10);
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const target = Buffer.from(storedHash, 'hex');
  if (derived.length !== target.length) return false;
  return crypto.timingSafeEqual(derived, target);
}

function createToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, iat: Date.now() }),
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = crypto
    .createHmac('sha256', getAuthSecret())
    .update(payload)
    .digest('base64url');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof decoded.sub === 'string' ? decoded.sub : null;
  } catch {
    return null;
  }
}

function sanitizeUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    number: user.number,
    language: user.language,
    bookmarks: user.bookmarks,
    createdAt: user.createdAt,
  };
}

function extractBearerUserId(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return verifyToken(header.slice(7).trim());
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const rawName = String(req.body?.name ?? '').trim();
    const rawNumber = String(req.body?.number ?? '');
    const rawPassword = String(req.body?.password ?? '');
    const language = req.body?.language;
    const bookmarks = Array.isArray(req.body?.bookmarks) ? req.body.bookmarks : [];

    const normalizedNumber = normalizePhoneNumber(rawNumber);

    if (rawName.length < 2 || rawName.length > 80) {
      res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
      return;
    }
    if (!/^\d{10}$/.test(normalizedNumber)) {
      res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    if (rawPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const users = readUsers();
    if (users.some((u) => u.number === normalizedNumber)) {
      res.status(409).json({
        error: 'An account with this mobile number already exists. Please sign in.',
      });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const validLang =
      language === 'hi' || language === 'ta' || language === 'te' ? language : 'en';

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: rawName,
      number: normalizedNumber,
      passwordHash: hashPassword(rawPassword, salt),
      passwordSalt: salt,
      language: validLang,
      bookmarks,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    const token = createToken(newUser.id);
    res.status(201).json({ token, user: sanitizeUser(newUser) });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const rawName = String(req.body?.name ?? '').trim();
    const rawNumber = String(req.body?.number ?? '');
    const rawPassword = String(req.body?.password ?? '');

    const normalizedNumber = normalizePhoneNumber(rawNumber);

    if (!/^\d{10}$/.test(normalizedNumber)) {
      res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    if (!rawPassword) {
      res.status(400).json({ error: 'Please enter your password.' });
      return;
    }

    const users = readUsers();
    const user = users.find((u) => u.number === normalizedNumber);
    if (!user || !verifyPassword(rawPassword, user.passwordSalt, user.passwordHash)) {
      res.status(401).json({ error: 'Invalid mobile number or password.' });
      return;
    }

    // Update display name if provided and different
    if (rawName.length >= 2 && rawName.length <= 80 && rawName !== user.name) {
      user.name = rawName;
      writeUsers(users);
    }

    const token = createToken(user.id);
    res.json({ token, user: sanitizeUser(user) });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const userId = extractBearerUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const users = readUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      res.status(401).json({ error: 'Session expired' });
      return;
    }
    res.json({ user: sanitizeUser(user) });
  });

  app.put('/api/user/state', (req: Request, res: Response) => {
    const userId = extractBearerUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const nextLang = req.body?.language;
    if (nextLang === 'en' || nextLang === 'hi' || nextLang === 'ta' || nextLang === 'te') {
      users[idx].language = nextLang;
    }
    if (Array.isArray(req.body?.bookmarks)) {
      users[idx].bookmarks = req.body.bookmarks;
    }

    writeUsers(users);
    res.json({ user: sanitizeUser(users[idx]) });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DailyNews server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
