"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function MarketplacePage() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [userUpvotes, setUserUpvotes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchInput, setSearchInput] = useState("");

  const fetchCourses = async (page = 1, search = "", sort = "newest") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { search }),
        sortBy: sort,
      });

      const response = await fetch(`/api/marketplace?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch published courses");
      }
      const data = await response.json();
      setCourses(data.courses || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/marketplace/favorites?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchUserUpvotes = async () => {
    if (!user?.id) return;
    
    try {
      // For now, we'll track upvotes in state. In a real app, you'd want a dedicated API
      // to fetch all user upvotes at once for better performance
      setUserUpvotes([]);
    } catch (error) {
      console.error("Error fetching user upvotes:", error);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, searchTerm, sortBy);
  }, [currentPage, searchTerm, sortBy]);

  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
      fetchUserUpvotes();
    }
  }, [user?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Course Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and explore courses created by other users
          </p>
        </div>
        <Link href="/dashboard/marketplace/favorites">
          <Button variant="outline" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z"></path>
            </svg>
            My Favorites
          </Button>
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search courses, topics, authors, difficulty..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
          {searchTerm && (
            <Button type="button" variant="ghost" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </form>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {pagination.totalItems && (
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {" "}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {" "}
              {pagination.totalItems} courses
            </div>
          )}
        </div>

        {searchTerm && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Search results for:</span>
            <span className="font-medium">"{searchTerm}"</span>
            <span className="text-muted-foreground">
              ({pagination.totalItems || 0} {pagination.totalItems === 1 ? 'result' : 'results'})
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">Error: {error}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground w-10 h-10"
            >
              <path d="M9 10h.01"></path>
              <path d="M15 10h.01"></path>
              <path d="M12 2a8 8 0 0 0-8 8c0 1.9.7 3.6 1.8 5L4 19h16l-1.8-4A7.9 7.9 0 0 0 20 10a8 8 0 0 0-8-8z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">
            {searchTerm ? `No courses found for "${searchTerm}"` : "No courses available"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchTerm 
              ? "Try adjusting your search terms or browse all courses."
              : "There are no published courses in the marketplace yet. Check back later or publish your own course."
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <MarketplaceCourseCard 
                key={course.id} 
                course={course} 
                userId={user?.id}
                isFavorited={favorites.includes(course.courseId)}
                onFavoriteChange={fetchFavorites}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MarketplaceCourseCard({ course, userId, isFavorited, onFavoriteChange }) {
  const [upvotes, setUpvotes] = useState(course.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

  const courseTitle = course?.courseLayout?.courseTitle || "Untitled Course";
  const courseSummary = course?.courseLayout?.courseSummary || "No description available";
  const chapterCount = course?.courseLayout?.chapters?.length || 0;
  
  const publicUrl = `${window.location.origin}/public/${course.publicSlug}`;

  // Check if user has upvoted this course
  useEffect(() => {
    const checkUpvoteStatus = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/marketplace/upvote?userId=${userId}&studyMaterialId=${course.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsUpvoted(data.isUpvoted);
        }
      } catch (error) {
        console.error("Error checking upvote status:", error);
      }
    };

    checkUpvoteStatus();
  }, [userId, course.id]);

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading || !userId) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/marketplace/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          studyMaterialId: course.id,
          userId: userId 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.upvotes);
        setIsUpvoted(data.isUpvoted);
        toast.success(data.message);
      } else {
        toast.error("Failed to manage upvote");
      }
    } catch (error) {
      console.error("Error managing upvote:", error);
      toast.error("Failed to manage upvote");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast.error("Please sign in to add favorites");
      return;
    }
    
    try {
      const response = await fetch("/api/marketplace/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          courseId: course.courseId,
          userId: userId 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFavorited(data.favorited);
        toast.success(data.message);
        onFavoriteChange();
      } else {
        toast.error("Failed to manage favorite");
      }
    } catch (error) {
      console.error("Error managing favorite:", error);
      toast.error("Failed to manage favorite");
    }
  };

  const handleShare = (platform) => {
    const text = `Check out this course: ${courseTitle}`;
    
    if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${publicUrl}`)}`;
      window.open(whatsappUrl, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(publicUrl);
      toast.success("Course URL copied to clipboard!");
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col relative group">
      {/* Favorite Button */}
      {userId && (
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={favorited ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 ${favorited ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z"></path>
          </svg>
        </button>
      )}

      <Link href={publicUrl} target="_blank" rel="noopener noreferrer">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <Image
                src="/knowledge.png"
                alt="Course icon"
                width={48}
                height={48}
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-xl line-clamp-2">{courseTitle}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                By {course.createdBy}
              </p>
              <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
               
              </svg>
              <span>{course?.difficultyLevel || "Easy"}</span>
              </div>
            </div>
            
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
            {courseSummary}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                <path d="M9 10h6"></path>
                <path d="M9 6h6"></path>
                <path d="M9 14h4"></path>
              </svg>
              <span>{chapterCount} chapters</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Upvote Button */}
              {userId && (
                <button
                  onClick={handleUpvote}
                  disabled={loading}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors ${
                    isUpvoted 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  } disabled:opacity-50`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill={isUpvoted ? "currentColor" : "none"}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                  </svg>
                  <span>{upvotes}</span>
                </button>
              )}

              {!userId && (
                <div className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                  </svg>
                  <span>{upvotes}</span>
                </div>
              )}

              {/* Share Dropdown */}
              <div className="relative group/share">
                <button className="p-1 rounded-md hover:bg-muted transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16,6 12,2 8,6"></polyline>
                    <line x1="12" x2="12" y1="2" y2="15"></line>
                  </svg>
                </button>
                
                <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all duration-200 z-20">
                  <div className="bg-white dark:bg-gray-800 border border-border rounded-lg shadow-lg p-2 min-w-32">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleShare('copy');
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                      </svg>
                      Copy URL
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleShare('whatsapp');
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              <span className="text-primary text-sm">View course →</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
