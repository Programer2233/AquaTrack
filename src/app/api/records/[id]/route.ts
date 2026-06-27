import { NextResponse } from 'next/server';
import { updateRecord, deleteRecord } from '@/lib/data';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const record = updateRecord(id, body);
    if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = deleteRecord(id);
    if (!success) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
