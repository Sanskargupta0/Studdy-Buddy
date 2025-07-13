"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PublicQuizPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/marketplace/course?slug=${slug}`);
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course");
        }
        const courseData = await courseResponse.json();
        setCourse(courseData.course);

        // Try to fetch quiz data
        try {
          const quizResponse = await fetch(`/api/study-type-content?courseId=${courseData.course.courseId}&type=Quiz`);
          if (quizResponse.ok) {
            const quizData = await quizResponse.json();
            if (quizData && quizData.content) {
              setQuizData(quizData.content);
            }
          }
        } catch (quizError) {
          console.log("No quiz available for this course");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizData.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-60 w-full rounded-xl" />
          <div className="flex justify-center gap-4 mt-6">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Course Not Found
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-6">
            {error || "The course you're looking for doesn't exist or is no longer public."}
          </p>
          <Button onClick={() => router.push("/dashboard/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / quizData.length) * 100);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/public/${slug}`)}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Back to Course
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quiz Results</h1>
            <p className="text-muted-foreground">
              {course?.courseLayout?.courseTitle}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-2xl mx-auto">
          <div className="border border-border rounded-xl p-8 bg-card text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              percentage >= 70 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {percentage >= 70 ? (
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold mb-2">{percentage}%</h2>
            <p className="text-xl mb-4">
              {score} out of {quizData.length} correct
            </p>
            
            <p className="text-muted-foreground mb-8">
              {percentage >= 70 ? "Great job! You have a good understanding of the material." : "Keep studying! You can improve with more practice."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetQuiz}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button variant="outline" onClick={() => router.push(`/public/${slug}`)}>
                Back to Course
              </Button>
            </div>
          </div>

          {/* Answer Review */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Review Your Answers</h3>
            {quizData.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.correctAnswer;
              return (
                <div key={index} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Your answer: {question.options[selectedAnswers[index]]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/public/${slug}`)}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Back to Course
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quiz</h1>
            <p className="text-muted-foreground">
              {course?.courseLayout?.courseTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Container */}
      {quizData.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
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
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No quiz available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            A quiz for this course is not yet available. Check back later or explore other study materials.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quizData.length}
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="border border-border rounded-xl p-8 bg-card">
            <h3 className="text-xl font-semibold mb-6">
              {quizData[currentQuestionIndex]?.question}
            </h3>

            <div className="space-y-3">
              {quizData[currentQuestionIndex]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {selectedAnswers[currentQuestionIndex] === index && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <Button
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
            >
              {currentQuestionIndex === quizData.length - 1 ? 'Finish Quiz' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
