import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";

function QuizCardItem({ quiz, userSelectedOption, isDisabled = false, selectedAnswer = null, className = "" }) {
  const [selectedOption, setSelectedOption] = useState();

  // Update the selected option if external state changes
  useEffect(() => {
    if (selectedAnswer) {
      setSelectedOption(selectedAnswer);
    }
  }, [selectedAnswer]);

  const handleOptionClick = (option) => {
    if (isDisabled) return;
    
    setSelectedOption(option);
    userSelectedOption(option);
  };

  return (
    <div className={`p-5 ${className}`}>
      <h2 className="font-bold text-xl sm:text-2xl mb-6">{quiz?.question}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quiz?.options?.map((option) => {
          // Create a unique key based on the question and option text
          const optionKey = `${quiz.question?.substring(0, 10)}-${option}`.replace(/\s+/g, '-');
          
          // Determine if this option is the correct answer
          const isCorrectAnswer = quiz?.answer === option;
          
          // Special styling for options when the question has been answered
          const isOptionSelected = selectedOption === option;
          const showCorrectStyles = isDisabled && isCorrectAnswer;
          const showIncorrectStyles = isDisabled && isOptionSelected && !isCorrectAnswer;
          
          return (
            <div
              key={`option-${optionKey}`}
              onClick={() => handleOptionClick(option)}
              className={`
                border rounded-xl p-4 text-left transition-all
                ${isDisabled ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}
                ${isOptionSelected && !isDisabled ? "bg-primary/90 text-white border-primary" : ""}
                ${showCorrectStyles ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700" : ""}
                ${showIncorrectStyles ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700" : ""}
                ${!isOptionSelected && !showCorrectStyles && !showIncorrectStyles ? "hover:bg-accent" : ""}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  flex-shrink-0 h-5 w-5 mt-0.5 rounded-full border 
                  ${isOptionSelected ? "border-white bg-white" : "border-gray-400"}
                  ${showCorrectStyles ? "border-green-500 bg-green-500" : ""}
                  ${showIncorrectStyles ? "border-red-500 bg-red-500" : ""}
                `}>
                  {(isOptionSelected || showCorrectStyles || showIncorrectStyles) && (
                    <div className="h-3 w-3 m-auto mt-1 rounded-full bg-primary"></div>
                  )}
                </div>
                
                <div className="text-base sm:text-lg">
                  {option}
                  {showCorrectStyles && !isOptionSelected && (
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400">(Correct answer)</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuizCardItem;
