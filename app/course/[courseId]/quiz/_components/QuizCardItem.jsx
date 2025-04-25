import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function QuizCardItem({ quiz, userSelectedOption }) {
  const [selectedOption, setSelectedOption] = useState();
  return (
    <div className="mt-10 p-5">
      <h2 className="font-bold  text-3xl text-center mb-5">{quiz?.question}</h2>

      <div className="grid grid-cols-2 gap-5 mt-8">
        {quiz?.options?.map((option, index) => (
          <h2
            onClick={() => {
              setSelectedOption(option);
              userSelectedOption(option);
            }}
            key={index}
            variant="outline"
            className={` border rounded-full p-3 px-3 text-center text-lg hover:bg-gray-200 cursor-pointer ${
              selectedOption === option &&
              "bg-primary text-white hover:bg-primary"
            }`}
          >
            {option}
          </h2>
        ))}
      </div>
    </div>
  );
}

export default QuizCardItem;
