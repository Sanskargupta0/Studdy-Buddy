import { Button } from "@/components/ui/button";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const MaterialCardItem = ({ item, studyTypeContent, course, refreshData }) => {
  const [loading, setLoading] = useState(false);

  const isContentReady = () => {
    if (!studyTypeContent) return false;

    const content = studyTypeContent[item.type.toLowerCase()];
    if (!content) return false;

    // For notes, check if array has items
    if (item.type === "notes") {
      return content.length > 0;
    }

    // For other types, check if array has items and they have content
    return content.length > 0 && content.some((item) => item.content);
  };

  const GenerateContent = async (e) => {
    try {
      e.preventDefault(); // Prevent navigation
      setLoading(true);
      let chapters = "";
      course?.courseLayout?.chapters.forEach((chapter) => {
        chapters = chapter?.chapterTitle + "," + chapters;
      });

      const result = await axios.post("/api/study-type-content", {
        courseId: course?.courseId,
        type: item.type,
        chapters: chapters,
      });

      refreshData(true);
      toast("Content generation started. Pls refresh after some time.");
    } catch (error) {
      console.error("Generation error:", error);
      toast(
        "Error generating content: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const contentReady = isContentReady();

  return (
    <Link href={"/course/" + course?.courseId + item.path}>
      <div
        className={`border shadow-md rounded-lg p-5 flex flex-col items-center ${
          !contentReady && "grayscale"
        }`}
      >
        {!contentReady ? (
          <h2 className="p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2">
            Generate
          </h2>
        ) : (
          <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">
            Ready
          </h2>
        )}

        <Image src={item.icon} alt={item.name} width={50} height={50} />
        <h2 className="font-medium mt-3">{item.name}</h2>
        <p className="text-gray-500 text-sm text-center">{item.desc}</p>

        {!contentReady ? (
          <Button
            className="mt-3 w-full"
            variant="outline"
            onClick={GenerateContent}
          >
            {loading && <RefreshCcw className="animate-spin" />}
            Generate
          </Button>
        ) : (
          <Button className="mt-3 w-full" variant="outline">
            View
          </Button>
        )}
      </div>
    </Link>
  );
};

export default MaterialCardItem;
