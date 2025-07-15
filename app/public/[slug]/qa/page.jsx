"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StepProgress from "../components/StepProgress";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function QnAPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [qnaData, setQnaData] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetQnA();
  }, []);

  const GetQnA = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/marketplace/course?slug=${slug}`);
      const courseId = res?.data?.course?.courseId;
      if (!courseId) {
        console.error("Course ID not found in response");
        return;
      }
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "QA",
      });
      setQnaData(result?.data?.content || []);
    } catch (error) {
      console.error("Error fetching Q&A data:", error);
      toast.error("Failed to load Q&A. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToCoursePage = () => {
    router.push(`/public/${slug}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back to Course Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={goToCoursePage}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Course
        </Button>
      </div>

      <h2 className="font-bold text-3xl mb-8 text-center text-primary">
        Question & Answer
      </h2>

      {loading ? (
        <div className="space-y-6">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full h-2 rounded-full" />
            ))}
          </div>

          {/* Question Skeleton */}
          <div className="p-6 rounded-lg shadow-md mb-6 border">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Answer Skeleton */}
          <div className="p-6 rounded-lg shadow-md border">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/6" />
          </div>
        </div>
      ) : qnaData.length > 0 ? (
        <>
          <StepProgress
            data={qnaData}
            stepCount={stepCount}
            attemptedQuestions={qnaData.map((item) => null)}
            setStepCount={(value) => setStepCount(value)}
          />

          <div className="mt-8 space-y-6">
            {/* Question Box */}
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-md mb-6 transition-all hover:shadow-lg">
              <h3 className="font-bold text-xl text-blue-700 mb-3">
                Question
              </h3>
              <p className="text-blue-900 leading-relaxed">
                {qnaData[stepCount]?.question}
              </p>
            </div>

            {/* Answer Box */}
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-md transition-all hover:shadow-lg">
              <h3 className="font-bold text-xl text-green-700 mb-3">
                Answer
              </h3>
              <p className="text-green-900 leading-relaxed">
                {qnaData[stepCount]?.answer}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStepCount((prev) => Math.max(0, prev - 1))}
                disabled={stepCount === 0}
              >
                Previous
              </Button>

              {stepCount === qnaData.length - 1 ? (
                <Button
                  onClick={goToCoursePage}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Finish & Go to Course Page
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setStepCount((prev) => Math.min(qnaData.length - 1, prev + 1))
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-10 border border-dashed rounded-xl">
          <p className="text-gray-600 mb-4">
            No Q&A data available for this course.
          </p>
          <Button onClick={goToCoursePage}>Go to Course Page</Button>
        </div>
      )}
    </div>
  );
}

export default function QnAPageWrapper() {
  return <QnAPage />;
}
