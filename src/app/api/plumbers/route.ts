import { NextRequest, NextResponse } from 'next/server';
import { getPlumbers, addPlumber } from '@/lib/data';

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') || undefined;
  return NextResponse.json(getPlumbers(status));
}

export async function POST(req: Request) {
  const body = await req.json();
  const plumber = addPlumber(body);
  return NextResponse.json(plumber, { status: 201 });
}
