import React, { useEffect, useState } from "react";
import axios from "axios";

const YouTubeRecommendations = ({ courseId, course }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (course && courseId) {
      getRecommendations();
    }
  }, [course, courseId]);

  const getRecommendations = async () => {
    try {
      setLoading(true);
      
      // First try to fetch existing recommendations
      const response = await axios.get(`/api/youtube-recommendations?courseId=${courseId}`);
      
      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      } else {
        // Generate new recommendations if none exist
        const postResponse = await axios.post("/api/youtube-recommendations", {
          courseId,
          topic: course.topic,
        });
        setRecommendations(postResponse.data.recommendations || []);
      }
    } catch (error) {
      console.error("Error fetching YouTube recommendations:", error);
      setError("Failed to load video recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-5">
        <h2 className="font-medium text-2xl">YouTube Recommendations</h2>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Loading video recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5">
        <h2 className="font-medium text-2xl">YouTube Recommendations</h2>
        <div className="mt-3 p-4 bg-red-50 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="mt-5">
        <h2 className="font-medium text-2xl">YouTube Recommendations</h2>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No video recommendations found for this course.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2 className="font-medium text-2xl">YouTube Recommendations</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((video) => (
          <div
            key={video.videoId}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg line-clamp-2">{video.title}</h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">{video.description}</p>
              <div className="mt-3 flex items-center">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {video.similarityScore}% match
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeRecommendations; 