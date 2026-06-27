import { NextResponse } from 'next/server';
import { getAreas, addArea } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getAreas());
}

export async function POST(req: Request) {
  const { name, region } = await req.json();
  const area = addArea(name, region);
  return NextResponse.json(area, { status: 201 });
}
