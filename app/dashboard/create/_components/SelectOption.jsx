import Image from "next/image";
import React, { useState } from "react";

function SelectOption({ selectedStudyType }) {
  const Options = [
    {
      name: "Exam",
      icon: "/exam_1.png",
    },
    {
      name: "Job Interview",
      icon: "/job.png",
    },
    {
      name: "Practice",
      icon: "/practice.png",
    },
    {
      name: "Coding Prep",
      icon: "/code.png",
    }
  ];
  const [selectedOption, setSelectedOption] = useState();
  return (
    <div className="w-full">
      <h2 className="text-center text-lg font-medium text-foreground mb-6">
        What's the purpose of your study material?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Options.map((option) => {
          const optionKey = option.name.toLowerCase().replace(/\s+/g, '-');
          const isSelected = option.name === selectedOption;
          
          return (
            <button
              key={`option-${optionKey}`}
              type="button"
              className={`p-4 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200
                ${
                  isSelected 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }
                hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2`}
              onClick={() => {
                setSelectedOption(option.name);
                selectedStudyType(option.name);
              }}
            >
              <div className={`p-3 rounded-lg mb-3 ${
                isSelected 
                  ? 'bg-primary/10 dark:bg-primary/20' 
                  : 'bg-muted/50'
              }`}>
                <Image 
                  src={option.icon} 
                  alt={option.name} 
                  width={40} 
                  height={40} 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <h2 className="text-sm font-medium text-foreground">
                {option.name}
              </h2>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SelectOption;
