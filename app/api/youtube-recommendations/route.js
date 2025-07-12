import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { YOUTUBE_RECOMMENDATIONS_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import axios from "axios";

// Function to get embedding from Gemini API
async function getEmbedding(text) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`,
      {
        content: { parts: [{ text }] }
      }
    );
    return response.data.embedding;
  } catch (error) {
    console.error("Error getting embedding:", error);
    throw error;
  }
}

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to search YouTube
async function searchYouTube(query) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          maxResults: 10,
          q: query,
          type: "video",
          key: apiKey
        }
      }
    );
    return response.data.items;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    throw error;
  }
}

export async function GET(req) {
  try {
    // Get courseId from URL
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Check if recommendations already exist for this course
    const existingRecommendations = await db
      .select()
      .from(YOUTUBE_RECOMMENDATIONS_TABLE)
      .where(eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId));

    if (existingRecommendations.length > 0) {
      return NextResponse.json({ recommendations: existingRecommendations });
    }

    // Since we don't have existing recommendations, return a message indicating processing needed
    return NextResponse.json({ message: "No recommendations found. Please use POST to generate." });
  } catch (error) {
    console.error("Error fetching YouTube recommendations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { courseId, topic } = body;

    if (!courseId || !topic) {
      return NextResponse.json(
        { error: "Course ID and topic are required" },
        { status: 400 }
      );
    }

    // Check if recommendations already exist
    const existingRecommendations = await db
      .select()
      .from(YOUTUBE_RECOMMENDATIONS_TABLE)
      .where(eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId));

    if (existingRecommendations.length > 0) {
      return NextResponse.json({ recommendations: existingRecommendations });
    }

    // Get topic embedding
    const topicEmbedding = await getEmbedding(topic);

    // Search YouTube
    const youtubeResults = await searchYouTube(topic);

    // Process each result
    const processedResults = await Promise.all(
      youtubeResults.map(async (video) => {
        const title = video.snippet.title;
        const description = video.snippet.description;
        const combinedText = `${title} ${description}`;
        
        // Get embedding for video content
        const videoEmbedding = await getEmbedding(combinedText);
        
        // Calculate similarity
        const similarity = cosineSimilarity(topicEmbedding.values, videoEmbedding.values);
        const similarityScore = Math.round(similarity * 100);
        
        return {
          videoId: video.id.videoId,
          title,
          description,
          thumbnailUrl: video.snippet.thumbnails.medium.url,
          similarityScore
        };
      })
    );

    // Sort by similarity score
    const sortedResults = processedResults.sort(
      (a, b) => b.similarityScore - a.similarityScore
    );

    // Take top 5 results
    const topResults = sortedResults.slice(0, 5);

    //check if any data is already present in the database
    const existingData = await db
      .select()
      .from(YOUTUBE_RECOMMENDATIONS_TABLE)
      .where(eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId));
    if (existingData.length > 0) {
      return NextResponse.json({ recommendations: existingData });
    }
    else{
    // Store in database
    const insertPromises = topResults.map((result) => 
      db.insert(YOUTUBE_RECOMMENDATIONS_TABLE).values({
        courseId,
        topic,
        videoId: result.videoId,
        title: result.title,
        description: result.description,
        thumbnailUrl: result.thumbnailUrl,
        similarityScore: result.similarityScore
      })
    );

    await Promise.all(insertPromises);

    return NextResponse.json({ recommendations: topResults });
  }
  } catch (error) {
    console.error("Error generating YouTube recommendations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 