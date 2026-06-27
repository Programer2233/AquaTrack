import { NextResponse } from 'next/server';
import { updateLeakReportStatus } from '@/lib/data';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const report = updateLeakReportStatus(id, status);
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(report);
}
