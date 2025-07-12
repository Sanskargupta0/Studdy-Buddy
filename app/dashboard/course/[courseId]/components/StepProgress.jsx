import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

function StepProgress({ stepCount, setStepCount, data, attemptedQuestions = [] }) {
  // Calculate total steps and current percentage
  const totalSteps = data.length;
  const progressPercentage = ((stepCount + 1) / totalSteps) * 100;
  
  // Handle step navigation
  const goToPreviousStep = () => setStepCount((prev) => Math.max(prev - 1, 0));
  const goToNextStep = () => setStepCount((prev) => Math.min(prev + 1, totalSteps - 1));
  const goToStep = (index) => setStepCount(index);
  
  return (
    <div className="w-full space-y-4">
      {/* Progress percentage display */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{stepCount + 1} of {totalSteps}</span>
        <span className="text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
      </div>
      
      {/* Main progress bar */}
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="relative py-4">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
        
        {/* Steps */}
        <div className="flex justify-between items-center">
          {data.map((_, index) => {
            // Determine the status of this step
            const isPassed = index <= stepCount;
            const isCurrent = index === stepCount;
            const isAttempted = attemptedQuestions[index] !== null;
            const isCorrect = attemptedQuestions[index] === true;
            const isIncorrect = attemptedQuestions[index] === false;
            
            return (
              <button
                key={`step-${index}`}
                onClick={() => goToStep(index)}
                className={`
                  relative flex items-center justify-center
                  w-7 h-7 rounded-full transition-all
                  ${isCurrent ? 'z-10' : ''}
                  ${isPassed ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                  ${isCurrent ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''}
                  ${isAttempted && isCorrect ? 'bg-green-500 text-white' : ''}
                  ${isAttempted && isIncorrect ? 'bg-red-500 text-white' : ''}
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900
                  sm:max w-5, h-5
                `}
                aria-label={`Go to step ${index + 1}`}
              >
                <span className="text-xs font-semibold">{index + 1}</span>
                
                {/* Small dot for correct/incorrect indicators */}
                {isAttempted &&  (
                  <span className={`
                    absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900
                    ${isCorrect ? 'bg-green-500' : 'bg-red-500'}
                  `} />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousStep}
          disabled={stepCount === 0}
          className="flex items-center gap-1 h-9"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        
        <div className="hidden sm:block text-sm font-medium text-center max-w-xs truncate px-2">
          {data[stepCount]?.question ? 
            data[stepCount].question.substring(0, 40) + (data[stepCount].question.length > 40 ? '...' : '') : ''}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextStep}
          disabled={stepCount === totalSteps - 1}
          className="flex items-center gap-1 h-9"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default StepProgress;
      
