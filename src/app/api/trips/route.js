import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from '@/lib/mongodb';
import Trip from '@/models/Trip';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const trips = await Trip.find({ userId: session.user.id }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const body = await request.json();
    
    const trip = await Trip.create({
      ...body,
      userId: session.user.id
    });
    
    return NextResponse.json({ success: true, data: trip }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
