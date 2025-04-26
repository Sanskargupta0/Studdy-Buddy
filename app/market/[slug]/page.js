"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function StudyMaterialDetailPage({ params }) {
  const { slug } = params;
  const router = useRouter();
  
  const [material, setMaterial] = useState(null);
  const [studyTypeContent, setStudyTypeContent] = useState([]);
  const [chapterNotes, setChapterNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copying, setCopying] = useState(false);
  
  // Handle upvote
  const handleUpvote = async () => {
    if (!material) return;
    
    try {
      const response = await fetch("/api/marketplace/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studyMaterialId: material.id }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to upvote");
      }
      
      // Update local state to avoid refetching
      setMaterial({
        ...material,
        upvotes: (material.upvotes || 0) + 1
      });
      
      toast.success("Upvote recorded successfully");
    } catch (err) {
      console.error("Error upvoting:", err);
      toast.error("Failed to record upvote");
    }
  };
  
  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    if (typeof window === 'undefined' || !material?.publicSlug) return;
    
    setCopying(true);
    try {
      const link = `${window.location.origin}/market/${material.publicSlug}`;
      navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    } finally {
      setCopying(false);
    }
  };
  
  // Fetch study material details
  useEffect(() => {
    const fetchStudyMaterial = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/marketplace/${slug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch study material: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMaterial(data.material);
        setStudyTypeContent(data.studyTypeContent || []);
        setChapterNotes(data.chapterNotes || []);
      } catch (err) {
        console.error("Error fetching study material:", err);
        setError(err.message);
        toast.error("Failed to load study material");
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchStudyMaterial();
    }
  }, [slug]);
  
  if (loading) {
    return (
      <div>
        <DashboardHeader />
        <div className="container mx-auto py-16 px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading study material...</p>
        </div>
      </div>
    );
  }
  
  if (error || !material) {
    return (
      <div>
        <DashboardHeader />
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-600 mb-6">{error || "Study material not found"}</p>
          <Link href="/market">
            <Button>Return to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Link href="/market" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg> 
            Back to Marketplace
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex gap-5 items-center">
              <div className="hidden md:block">
                <Image src="/knowledge.png" alt="knowledge" width={70} height={70} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{material.topic}</h1>
                <div className="flex gap-2 text-sm text-gray-600 mb-4">
                  <span className="px-2 py-1 bg-gray-100 rounded">{material.difficultyLevel}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">{material.courseType}</span>
                </div>
                <p className="text-gray-600">Created by: {material.createdBy}</p>
              </div>
            </div>
            
            <button
              onClick={handleUpvote}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
              <span>Upvote ({material.upvotes || 0})</span>
            </button>
          </div>
          
          {/* Share section */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-medium mb-3">Share this Study Material</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-100 p-2 rounded text-sm overflow-auto">
                {typeof window !== 'undefined' && `${window.location.origin}/market/${material.publicSlug}`}
              </div>
              <Button
                onClick={copyLinkToClipboard}
                disabled={copying}
              >
                {copying ? "Copying..." : "Copy Link"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Course Layout */}
        {material.courseLayout && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Course Layout</h2>
            <div className="prose max-w-none">
              {typeof material.courseLayout === 'string' 
                ? <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{material.courseLayout}</pre>
                : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {material.courseLayout.courseTitle && (
                      <h3 className="text-xl font-semibold mb-2">{material.courseLayout.courseTitle}</h3>
                    )}
                    {material.courseLayout.courseSummary && (
                      <p className="mb-4">{material.courseLayout.courseSummary}</p>
                    )}
                    {material.courseLayout.chapters && material.courseLayout.chapters.length > 0 && (
                      <div className="space-y-4 mt-4">
                        <h4 className="text-lg font-medium">Chapters</h4>
                        {material.courseLayout.chapters.map((chapter, index) => (
                          <div key={index} className="border p-3 rounded">
                            <h5 className="font-medium">Chapter {index + 1}: {chapter.title}</h5>
                            {chapter.summary && <p className="text-sm mt-1">{chapter.summary}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
            </div>
          </div>
        )}
        
        {/* Study Type Content */}
        {studyTypeContent.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Study Content</h2>
            
            <div className="space-y-8">
              {studyTypeContent.map((item) => (
                <div key={item.id} className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">{item.type}</h3>
                  <div className="prose max-w-none">
                    {typeof item.content === 'string' 
                      ? <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{item.content}</pre>
                      : <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{JSON.stringify(item.content, null, 2)}</pre>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Chapter Notes */}
        {chapterNotes.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Chapter Notes</h2>
            
            <div className="space-y-8">
              {chapterNotes.map((note) => (
                <div key={note.id} className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Chapter {note.chapterId}</h3>
                  <div className="prose max-w-none bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {note.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 