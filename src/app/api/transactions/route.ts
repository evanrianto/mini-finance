import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  const transactions = await prisma.transaction.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      category: data.category,
      type: data.type,
      date: new Date(data.date),
      tags: Array.isArray(data.tags) ? data.tags.join(',') : (data.tags || ''),
    },
  });
  return NextResponse.json(transaction, { status: 201 });
} 