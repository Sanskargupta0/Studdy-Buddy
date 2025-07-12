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

  // Loading state
  if (loading) {
    return (
      <section className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Video Recommendations</h2>
            <p className="text-muted-foreground mt-1">Curated videos to enhance your learning</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border bg-card rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted"></div>
              <div className="p-4">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-5/6 mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3 mt-3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Video Recommendations</h2>
            <p className="text-muted-foreground mt-1">Curated videos to enhance your learning</p>
          </div>
        </div>
        <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">Error loading recommendations</h3>
              <p className="mt-2 text-sm text-destructive">
                {error}
              </p>
              <div className="mt-4">
                <button
                  onClick={getRecommendations}
                  className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                >
                  Try again <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (recommendations.length === 0) {
    return (
      <section className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Video Recommendations</h2>
            <p className="text-muted-foreground mt-1">Curated videos to enhance your learning</p>
          </div>
        </div>
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-foreground">No videos found</h3>
          <p className="mt-1 text-muted-foreground">We couldn't find any video recommendations for this course.</p>
          <div className="mt-6">
            <button
              onClick={getRecommendations}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Main content
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Video Recommendations</h2>
          <p className="text-muted-foreground mt-1">Curated videos to enhance your learning</p>
        </div>
        <button
          onClick={getRecommendations}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((video, index) => (
          <div
            key={index}
            className="group relative flex flex-col border border-border bg-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            {/* Video Thumbnail */}
            <div className="aspect-video w-full bg-muted relative">
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 text-foreground p-2 rounded-full">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                aria-label={`Watch ${video.title} on YouTube`}
              ></a>
            </div>
            
            {/* Video Info */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-medium text-lg text-foreground line-clamp-2 mb-2">
                {video.title}
              </h3>
              <p className="text-muted-foreground text-sm flex-1 line-clamp-3 mb-4">
                {video.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    parseFloat(video.similarityScore) > 75 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : parseFloat(video.similarityScore) > 50
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                  }`}>
                    {video.similarityScore}% match
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YouTubeRecommendations; 