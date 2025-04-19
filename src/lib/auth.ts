import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import dbConnect from './db/connect';
import User from './db/models/User';

// Get the JWT secret from .env and enforce its presence
if (!process.env.JWT_SECRET) {
  throw new Error('Environment variable JWT_SECRET must be set to a secure value.');
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createSessionToken(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return token;
}

// Register a new user
export async function signUp(email: string, password: string) {
  await dbConnect();
  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    userName: `user_${Date.now()}`,
    fileId: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  });

  return user;
}

// Authenticate user
export async function signIn(email: string, password: string) {
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return user;
}

// Check if the user is authenticated
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;

  if (!token) {
    return null;
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { userId } = payload as { userId: string };

    // Find the user with the userId from the token
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}