import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signAccess } from '../utils/tokens.js';

// REGISTER
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already used" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = signAccess(user);

    // cookie (optional if you want browser-only auth)
    res.cookie("accessToken", token, { httpOnly: true, sameSite: "lax" });

    // response body (needed for Postman/frontend)
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token   // 👈 now client can see and save it
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// LOGIN
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signAccess(user);

  // cookie (browser sessions)
  res.cookie("accessToken", token, { httpOnly: true, sameSite: "lax" });

  // response body
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token   // 👈 this was missing earlier
  });
}

// ME
export function me(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  res.json({ user: { id: req.user.id, role: req.user.role } });
}
