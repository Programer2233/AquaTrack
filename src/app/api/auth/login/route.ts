import { NextResponse } from 'next/server';
import { validateAdmin } from '@/lib/data';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const admin = validateAdmin(username, password);
  if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  return NextResponse.json({ name: admin.name, username: admin.username });
}
