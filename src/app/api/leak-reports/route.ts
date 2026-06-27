import { NextResponse } from 'next/server';
import { getLeakReports, addLeakReport } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getLeakReports());
}

export async function POST(req: Request) {
  const body = await req.json();
  const report = addLeakReport(body);
  return NextResponse.json(report, { status: 201 });
}
