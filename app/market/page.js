"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function MarketplacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [materials, setMaterials] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get search parameters
  const search = searchParams?.get("search") || "";
  const page = parseInt(searchParams?.get("page") || "1", 10);
  const difficulty = searchParams?.get("difficulty") || "";
  const courseType = searchParams?.get("courseType") || "";
  const sortBy = searchParams?.get("sortBy") || "upvotes";
  
  // Fetch materials with memoized callback to prevent unnecessary re-renders
  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (page) queryParams.set("page", page.toString());
      if (difficulty) queryParams.set("difficulty", difficulty);
      if (courseType) queryParams.set("courseType", courseType);
      if (sortBy) queryParams.set("sortBy", sortBy);
      
      const response = await fetch(`/api/marketplace?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch marketplace materials: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMaterials(data.materials || []);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10
      });
    } catch (err) {
      console.error("Error fetching marketplace data:", err);
      setError(err.message);
      toast.error("Failed to load marketplace materials");
    } finally {
      setLoading(false);
    }
  }, [search, page, difficulty, courseType, sortBy]);
  
  // Handle upvote with error handling
  const handleUpvote = async (studyMaterialId, event) => {
    // Prevent event bubbling to avoid navigation
    event.stopPropagation();
    
    try {
      const response = await fetch("/api/marketplace/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studyMaterialId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to upvote");
      }
      
      // Update locally first for better UX
      setMaterials(prevMaterials => 
        prevMaterials.map(material => 
          material.id === studyMaterialId 
            ? {...material, upvotes: (material.upvotes || 0) + 1} 
            : material
        )
      );
      
      toast.success("Upvote recorded successfully");
    } catch (err) {
      console.error("Error upvoting:", err);
      toast.error("Failed to record upvote");
    }
  };
  
  // Update URL with search parameters
  const updateSearchParams = useCallback((params) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Reset to page 1 if filters change
    if (!params.hasOwnProperty("page")) {
      newParams.set("page", "1");
    }
    
    router.push(`/market?${newParams.toString()}`);
  }, [searchParams, router]);
  
  // Load materials on first render and when search params change
  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchTerm = formData.get("search");
    updateSearchParams({ search: searchTerm });
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    updateSearchParams({ [filterType]: value });
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage.toString() });
  };
  
  return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Study Material Marketplace</h1>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              name="search"
              placeholder="Search topics..."
              defaultValue={search}
              className="flex-1 p-2 border rounded"
            />
            <Button type="submit">Search</Button>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            {/* Course Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Course Type</label>
              <select
                value={courseType}
                onChange={(e) => handleFilterChange("courseType", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Types</option>
                <option value="Lecture">Lecture</option>
                <option value="Workshop">Workshop</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>
            
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="upvotes">Most Upvoted</option>
                <option value="date">Newest</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading study materials...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">
            <p className="text-xl mb-4">Something went wrong</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchMaterials}>Try Again</Button>
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-xl mb-4">No study materials found</p>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button onClick={() => updateSearchParams({search: '', difficulty: '', courseType: ''})}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Link 
                href={`/market/${material.publicSlug}`}
                key={material.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2 truncate">{material.topic}</h2>
                  <div className="flex gap-2 text-sm text-gray-600 mb-3">
                    <span className="px-2 py-1 bg-gray-100 rounded">{material.difficultyLevel}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{material.courseType}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">By {material.createdBy}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 hover:underline">
                      View Details
                    </span>
                    
                    <button
                      onClick={(e) => handleUpvote(material.id, e)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                      </svg>
                      <span>{material.upvotes || 0}</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage <= 1}
                className="px-2 py-1"
              >
                ←
              </Button>
              
              {/* Show pagination numbers with ellipsis for many pages */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  // Always show first, last, current, and pages close to current
                  return pageNum === 1 || 
                    pageNum === pagination.totalPages || 
                    Math.abs(pageNum - pagination.currentPage) <= 1;
                })
                .map((pageNum, index, filtered) => {
                  // Add ellipsis where needed
                  const prevPage = filtered[index - 1];
                  const showEllipsis = prevPage && pageNum - prevPage > 1;
                  
                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsis && <span className="px-2">...</span>}
                      <Button
                        variant={pageNum === pagination.currentPage ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10 h-10"
                      >
                        {pageNum}
                      </Button>
                    </React.Fragment>
                  );
                })
              }
              
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-2 py-1"
              >
                →
              </Button>
            </nav>
          </div>
        )}
      </div>
  );
} 