import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/db-setup/mongodb';
import CommunityPost from '@/database-models/CommunityPost';

// GET all community posts
export async function GET() {
  try {
    await connectMongo();
    const posts = await CommunityPost.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create a new community post
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const body = await request.json();

    const post = await CommunityPost.create({
      userId: session.user.id,
      userName: session.user.name,
      tripName: body.tripName,
      destination: body.destination,
      coverPhoto: body.coverPhoto || '',
      description: body.description || '',
      tags: body.tags || [],
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

