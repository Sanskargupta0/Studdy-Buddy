"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StepProgress from "../components/StepProgress";
import QuizCardItem from "./_components/QuizCardItem";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, Trophy, RefreshCw, ArrowLeft } from "lucide-react";

function Quiz() {
  const { slug } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    GetQuiz();
  }, []);

  const GetQuiz = async () => {
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
        studyType: "Quiz",
      });
      const questions = result?.data?.content?.questions || [];
      setQuiz(questions);
      
      // Initialize attempted questions array with same length as quiz
      setAttemptedQuestions(Array(questions.length).fill(null));

      // Set the initial correct answer if questions exist
      if (questions.length > 0) {
        setCorrectAnswer(questions[0]?.answer);
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error("Failed to fetch quiz data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (userAnswer, currentQuestion) => {
    // Skip if this question has already been attempted
    if (attemptedQuestions[stepCount] !== null) {
      return;
    }
    
    const isCorrect = userAnswer === currentQuestion.answer;
    setIsCorrectAnswer(isCorrect);
    setCorrectAnswer(currentQuestion.answer);
    
    // Update score: +1 for correct, -1 for incorrect
    setScore(prevScore => isCorrect ? prevScore + 1 : prevScore - 1);
    
    // Mark question as attempted and store result
    const updatedAttempts = [...attemptedQuestions];
    updatedAttempts[stepCount] = isCorrect;
    setAttemptedQuestions(updatedAttempts);
  };

  useEffect(() => {
    if (quiz.length > 0) {
      setCorrectAnswer(quiz[stepCount]?.answer);
      // Don't reset isCorrectAnswer to maintain the feedback state when navigating
    }
  }, [stepCount, quiz]);

  const goToCoursePage = () => {
    router.push(`/public/${slug}`);
  };

  const resetQuiz = () => {
    setScore(0);
    setStepCount(0);
    setIsCorrectAnswer(null);
    setAttemptedQuestions(Array(quiz.length).fill(null));
    setQuizCompleted(false);
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
  };

  // Calculate statistics for the results screen
  const calculateStats = () => {
    const answered = attemptedQuestions.filter(q => q !== null).length;
    const correct = attemptedQuestions.filter(q => q === true).length;
    const incorrect = attemptedQuestions.filter(q => q === false).length;
    const skipped = quiz.length - answered;
    
    return { answered, correct, incorrect, skipped };
  };

  // Determine if all questions have been attempted
  const allQuestionsAttempted = !attemptedQuestions.includes(null);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
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
      {quizCompleted ? (
        // Quiz Results Screen
        <div className="bg-card text-card-foreground rounded-xl p-6 border shadow-md transition-all">
          <div className="text-center mb-8">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="font-bold text-3xl mb-2">Quiz Completed!</h2>
            <p className="text-muted-foreground">Your final score: <span className="font-bold text-xl text-primary">{score}</span></p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Statistics Cards */}
            <div className="bg-primary/10 rounded-xl p-4 flex flex-col items-center">
              <div className="font-semibold text-lg">{calculateStats().correct}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            
            <div className="bg-destructive/10 rounded-xl p-4 flex flex-col items-center">
              <div className="font-semibold text-lg">{calculateStats().incorrect}</div>
              <div className="text-sm text-muted-foreground">Incorrect Answers</div>
            </div>
            
            <div className="bg-yellow-500/10 rounded-xl p-4 flex flex-col items-center">
              <div className="font-semibold text-lg">{calculateStats().skipped}</div>
              <div className="text-sm text-muted-foreground">Skipped Questions</div>
            </div>
            
            <div className="bg-blue-500/10 rounded-xl p-4 flex flex-col items-center">
              <div className="font-semibold text-lg">{calculateStats().answered}</div>
              <div className="text-sm text-muted-foreground">Questions Attempted</div>
            </div>
          </div>
          
          {/* Performance Analysis */}
          <div className="mb-8 p-4 rounded-xl bg-accent/50">
            <h3 className="font-semibold text-lg mb-2">Performance Analysis</h3>
            {score > 0 ? (
              <p>Great job! You scored positively, showing a good understanding of the material.</p>
            ) : score < 0 ? (
              <p>You might want to review the material again to improve your understanding.</p>
            ) : (
              <p>Your correct and incorrect answers balanced out. Consider reviewing challenging topics.</p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={resetQuiz}
            >
              <RefreshCw size={16} /> Restart Quiz
            </Button>
            
            <Button 
              onClick={goToCoursePage}
              className="flex items-center gap-2"
            >
              Return to Course
            </Button>
          </div>
        </div>
      ) : (
        // Quiz Taking Interface
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-2xl sm:text-3xl text-primary">Quiz</h2>
            
            {/* Score Display */}
            <div className="flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-full">
              <span className="font-medium">Score:</span>
              <span className={`font-bold ${score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : ''}`}>
                {score}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-2 rounded-full" />
                ))}
              </div>
              
              {/* Quiz Question Skeleton */}
              <div className="border p-6 rounded-xl shadow-sm">
                <Skeleton className="h-6 w-2/3 mb-4" />
                <div className="space-y-3 mt-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : quiz.length > 0 ? (
            <>
              <div className="mb-6">
                <StepProgress
                  data={quiz}
                  stepCount={stepCount}
                  setStepCount={(value) => setStepCount(value)}
                  attemptedQuestions={attemptedQuestions}
                />
              </div>

              <div className="bg-card text-card-foreground rounded-xl border shadow-sm transition-all hover:shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Question {stepCount + 1} of {quiz.length}</h3>
                  
                  {/* Question Status Indicator */}
                  {attemptedQuestions[stepCount] === true && (
                    <div className="flex items-center gap-1 text-green-500 text-sm">
                      <CheckCircle2 size={14} />
                      <span>Correct</span>
                    </div>
                  )}
                  
                  {attemptedQuestions[stepCount] === false && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <XCircle size={14} />
                      <span>Incorrect</span>
                    </div>
                  )}
                </div>
                
                <QuizCardItem
                  className="mt-4"
                  quiz={quiz[stepCount]}
                  userSelectedOption={(v) => checkAnswer(v, quiz[stepCount])}
                  isDisabled={attemptedQuestions[stepCount] !== null}
                  selectedAnswer={attemptedQuestions[stepCount] !== null ? 
                    (attemptedQuestions[stepCount] ? quiz[stepCount].answer : null) : null}
                />
              </div>

              {isCorrectAnswer !== null && attemptedQuestions[stepCount] !== null && (
                <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  isCorrectAnswer 
                    ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                    : "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}>
                  {isCorrectAnswer ? (
                    <>
                      <CheckCircle2 className="text-green-500 dark:text-green-400 h-6 w-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg text-green-700 dark:text-green-400">Correct!</h3>
                        <p className="text-green-600 dark:text-green-400">+1 point added to your score.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-500 dark:text-red-400 h-6 w-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg text-red-700 dark:text-red-400">Incorrect</h3>
                        <p className="text-red-600 dark:text-red-400">-1 point deducted from your score.</p>
                        <p className="text-red-600 dark:text-red-400 font-medium mt-1">The correct answer is: {correctAnswer}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Quiz Progress Alert */}
              {allQuestionsAttempted && !quizCompleted && (
                <div className="mb-6 p-4 rounded-lg flex items-start gap-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <AlertTriangle className="text-yellow-500 dark:text-yellow-400 h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-yellow-700 dark:text-yellow-400">Quiz Complete!</h3>
                    <p className="text-yellow-600 dark:text-yellow-400">You've attempted all questions. Click 'Finish Quiz' to see your results.</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStepCount((prev) => Math.max(0, prev - 1))}
                  disabled={stepCount === 0}
                  className="flex-1 sm:flex-none"
                >
                  Previous
                </Button>

                <div className="flex flex-1 gap-4">
                  {allQuestionsAttempted ? (
                    <Button
                      onClick={finishQuiz}
                      className="bg-green-500 hover:bg-green-600 text-white flex-1"
                    >
                      Finish Quiz
                    </Button>
                  ) : stepCount === quiz.length - 1 ? (
                    <Button
                      variant="outline"
                      onClick={finishQuiz}
                      className="flex-1"
                      disabled={!attemptedQuestions.some(q => q !== null)}
                    >
                      Finish Anyway
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setStepCount((prev) => Math.min(quiz.length - 1, prev + 1))}
                      className="flex-1"
                    >
                      Next Question
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-10 border border-dashed rounded-xl">
              <p className="text-muted-foreground mb-4">No quiz questions available for this course.</p>
              <Button onClick={goToCoursePage}>
                Go to Course Page
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function QuizWrapper() {
  return <Quiz />;
}
