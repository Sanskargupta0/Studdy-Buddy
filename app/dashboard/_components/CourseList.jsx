"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CourseCountContext } from "@/app/_context/CourseCountContext";

function CourseList() {
  const { user, isLoaded } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setTotalCourse } = useContext(CourseCountContext);

  useEffect(() => {
    if (isLoaded && user) {
      GetCourseList();
    }
  }, [isLoaded, user]);

  const GetCourseList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      setLoading(true);
      const result = await axios.post("/api/courses", {
        createdBy: user.primaryEmailAddress.emailAddress,
      });
      setCourseList(result.data.result || []);
      setTotalCourse(result.data.result.length);
    } catch (error) {
      console.error("Error fetching course list:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl flex justify-between items-center">
        Your Study Material
        <Button
          variant="outline"
          onClick={GetCourseList}
          className="border-primary text-primary"
          disabled={loading}
        >
          <RefreshCw className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </h2>
      <div className="grid grid-col-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {!loading
          ? courseList?.map((course, index) => (
              <CourseCardItem course={course} key={course.id || index} />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className="h-56 w-full bg-slate-200 rounded-lg animate-pulse"
              />
            ))}
      </div>
    </div>
  );
}

export default CourseList;
