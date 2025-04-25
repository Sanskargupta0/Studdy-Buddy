"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StepProgress from "../components/StepProgress";
import { toast } from "sonner";

function QnAPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [qnaData, setQnaData] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    GetQnA();
  }, []);

  const GetQnA = async () => {
    try {
      setLoading(true); // Start loading
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "QA",
      });
      setQnaData(result?.data?.content || []);
    } catch (error) {
      console.error("Error fetching Q&A data:", error);
    } finally {
      setLoading(false); // Stop loading
      toast.success("Pls Refresh! If QnA is not displayed"); // Show success toast
    }
  };

  const goToCoursePage = () => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-3xl mb-8 text-center">Question & Answer</h2>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-500 mt-10">Loading Q&A...</div>
      ) : qnaData.length > 0 ? (
        <>
          <StepProgress
            data={qnaData}
            stepCount={stepCount}
            setStepCount={(value) => setStepCount(value)}
          />

          <div className="mt-8">
            {/* Question Box */}
            <div className="p-6 bg-blue-100 border border-blue-400 rounded-lg shadow-md mb-6">
              <h3 className="font-bold text-xl text-blue-700">Question</h3>
              <p className="text-blue-900 mt-2">
                {qnaData[stepCount]?.question}
              </p>
            </div>

            {/* Answer Box */}
            <div className="p-6 bg-green-100 border border-green-400 rounded-lg shadow-md">
              <h3 className="font-bold text-xl text-green-700">Answer</h3>
              <p className="text-green-900 mt-2">
                {qnaData[stepCount]?.answer}
              </p>
            </div>

            {/* Show "Go to Course Page" on Last Question */}
            {stepCount === qnaData.length - 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={goToCoursePage}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                >
                  Go to Course Page
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No Q&A data available for this course.
        </div>
      )}
    </div>
  );
}

export default QnAPage;
