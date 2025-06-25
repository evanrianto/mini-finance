import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(transaction);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      amount: data.amount,
      description: data.description,
      category: data.category,
      type: data.type,
      date: new Date(data.date),
      tags: Array.isArray(data.tags) ? data.tags.join(',') : (data.tags || ''),
    },
  });
  return NextResponse.json(transaction);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 