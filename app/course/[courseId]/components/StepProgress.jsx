import { Button } from "@/components/ui/button";
import React from "react";

function StepProgress({ stepCount, setStepCount, data }) {
  return (
    <div className="flex gap-5 items-center">
      {stepCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStepCount((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </Button>
      )}

      {data.map((_, index) => {
        // Create a stable key that won't change between renders
        // but will be unique for each step
        const stepKey = `step-${index}-${Date.now()}`;
        return (
          <div
            key={stepKey}
            className={`w-full h-2 rounded-full ${
              index <= stepCount ? "bg-primary" : "bg-gray-200"
            }`}
          />
        );
      })}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setStepCount((prev) => Math.min(prev + 1, data.length - 1))
        }
      >
        Next
      </Button>
    </div>
  );
}

export default StepProgress;
