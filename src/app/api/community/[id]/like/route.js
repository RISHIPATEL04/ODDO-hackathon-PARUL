import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/db-setup/mongodb';
import CommunityPost from '@/database-models/CommunityPost';

// POST /api/community/:id/like — toggle like
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const { id } = await params;
    const post = await CommunityPost.findById(id);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const userId = session.user.id;
    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    return NextResponse.json({ success: true, likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
