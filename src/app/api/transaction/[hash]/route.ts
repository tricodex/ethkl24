import { NextRequest, NextResponse } from 'next/server';
import { getPublicClient } from '@/lib/homyClient';
import { Hash } from 'viem';

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  const hash = params.hash as Hash;
  try {
    const publicClient = getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    return NextResponse.json(receipt);
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction receipt' }, { status: 500 });
  }
}