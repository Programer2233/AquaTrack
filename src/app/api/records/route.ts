import { NextResponse } from 'next/server';
import { getRecords, addRecord } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getRecords());
}

export async function POST(req: Request) {
  const body = await req.json();
  const record = addRecord(body);
  return NextResponse.json(record, { status: 201 });
}
