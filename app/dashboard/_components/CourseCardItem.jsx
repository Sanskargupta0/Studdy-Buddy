"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CourseCardItem({ course }) {
  return (
    <div className="border rounded-lg shadow-md p-5">
      <div>
        <div className="flex  justify-between items-center">
          <Image src={"/knowledge.png"} alt="other" width={50} height={50} />
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-blue-600 text-white">
            {course?.status}
          </h2>
        </div>
        <h2 className="mt-3 font-medium text-lg">
          {course?.courseLayout?.courseTitle}
        </h2>
        <p className="text-sm line-clamp-2 text-gray-500 mt-3">
          {course?.courseLayout?.courseSummary}
        </p>

        <div className="mt-4">
          <Progress value={0} />
        </div>

        <div className="mt-6 flex justify-end items-baseline">
          {course?.status == "Generating" ? (
            <Button disabled>Generating</Button>
          ) : (
            <Link href={"/course/" + course?.courseId}>
              <Button>View</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCardItem;
