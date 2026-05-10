import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://127.0.0.1:27017/traveloop";

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userName: { type: String, required: true },
  tripName: { type: String, required: true },
  destination: { type: String, required: true },
  coverPhoto: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId }],
  comments: [CommentSchema],
}, { timestamps: true });

const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Clear existing community posts
    await CommunityPost.deleteMany({});

    // Create dummy user IDs for likes and comments
    const user1 = new mongoose.Types.ObjectId();
    const user2 = new mongoose.Types.ObjectId();
    const user3 = new mongoose.Types.ObjectId();

    const samplePosts = [
      {
        userId: new mongoose.Types.ObjectId(),
        userName: "Aisha Sharma",
        tripName: "Majestic Rajasthan",
        destination: "Jaipur & Udaipur, India",
        coverPhoto: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop",
        description: "A 7-day royal journey through the land of kings. We explored the Amber Fort, stayed in a heritage haveli, and took a sunset boat ride on Lake Pichola. The local dal bati churma was unforgettable!",
        tags: ["Culture", "Luxury"],
        likes: [user1, user2],
        comments: [
          { userId: user3, userName: "Rohan Das", text: "This looks incredible! Where did you stay in Udaipur?" }
        ]
      },
      {
        userId: new mongoose.Types.ObjectId(),
        userName: "David Chen",
        tripName: "Himalayan Escape",
        destination: "Manali, Himachal Pradesh",
        coverPhoto: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
        description: "Trekking through the Solang Valley and crossing the Rohtang Pass. The air was crisp, the mountains were majestic, and the paragliding experience was the highlight of the trip. Highly recommend visiting in early June.",
        tags: ["Adventure", "Mountains", "Nature"],
        likes: [user1, user2, user3],
        comments: []
      },
      {
        userId: new mongoose.Types.ObjectId(),
        userName: "Priya Patel",
        tripName: "Backpacking through Bali",
        destination: "Ubud & Canggu, Indonesia",
        coverPhoto: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
        description: "Spent two weeks exploring the rice terraces of Ubud and surfing the waves in Canggu. The floating breakfasts and jungle swings were totally worth the hype. Met some amazing fellow travelers along the way.",
        tags: ["Beach", "Solo", "Adventure"],
        likes: [user2],
        comments: [
          { userId: user1, userName: "Aisha Sharma", text: "Bali is on my bucket list! Did you rent a scooter?" }
        ]
      },
      {
        userId: new mongoose.Types.ObjectId(),
        userName: "Vikram Singh",
        tripName: "Kerala Backwaters",
        destination: "Alleppey, Kerala",
        coverPhoto: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop",
        description: "Two peaceful nights on a traditional houseboat navigating the intricate network of backwaters in 'God's Own Country'. The fresh seafood caught and cooked right on the boat was absolutely delicious.",
        tags: ["Nature", "Relaxation", "Food"],
        likes: [user1, user3],
        comments: []
      },
      {
        userId: new mongoose.Types.ObjectId(),
        userName: "Elena Rodriguez",
        tripName: "Neon Nights",
        destination: "Tokyo, Japan",
        coverPhoto: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
        description: "From the busy scramble of Shibuya to the quiet shrines of Asakusa. We spent days eating authentic ramen, hunting for vintage clothes in Harajuku, and experiencing the incredible nightlife of Shinjuku.",
        tags: ["City", "Food", "Culture"],
        likes: [user2, user3],
        comments: [
          { userId: user1, userName: "Vikram Singh", text: "Wow, those neon lights! Any restaurant recommendations?" }
        ]
      },
      {
        userId: new mongoose.Types.ObjectId(),
        userName: "Rahul Verma",
        tripName: "Goan Sunsets",
        destination: "South Goa, India",
        coverPhoto: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
        description: "Skipped the crowded northern beaches for the tranquil shores of Palolem and Agonda. Perfect mix of relaxing on the beach, visiting old Portuguese churches, and enjoying the vibrant shack culture.",
        tags: ["Beach", "Budget", "Relaxation"],
        likes: [user1, user2, user3],
        comments: []
      }
    ];

    await CommunityPost.insertMany(samplePosts);
    console.log("Successfully seeded 6 community posts with images!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
