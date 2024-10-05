// src/app/api/transaction/[hash]/route.ts

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

    // Convert BigInt values to strings
    const serializedReceipt = JSON.parse(JSON.stringify(receipt, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serializedReceipt);
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction receipt' }, { status: 500 });
  }
}