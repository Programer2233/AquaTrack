import { NextResponse } from 'next/server';
import { updatePlumberStatus } from '@/lib/data';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const plumber = updatePlumberStatus(id, status);
  if (!plumber) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(plumber);
}
