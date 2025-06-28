import { Textarea } from "@/components/ui/textarea";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TopicInput({ setTopic, setDifficultyLevel }) {
  return (
    <div className="space-y-6 w-full">
      <div>
        <label 
          htmlFor="topic-input"
          className="block text-sm font-medium text-foreground mb-2"
        >
          What would you like to learn about?
        </label>
        <Textarea
          id="topic-input"
          placeholder="E.g., Machine Learning Fundamentals, French Revolution, or paste your content here..."
          className="min-h-[120px] bg-background text-foreground border-input focus-visible:ring-2 focus-visible:ring-primary/50"
          onChange={(event) => setTopic(event.target.value)}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Be as specific as possible for better results
        </p>
      </div>

      <div>
        <label 
          htmlFor="difficulty-level"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Difficulty Level
        </label>
        <Select onValueChange={(value) => setDifficultyLevel(value)}>
          <SelectTrigger 
            id="difficulty-level"
            className="w-full bg-background text-foreground"
          >
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            <SelectItem 
              value="Easy" 
              className="focus:bg-accent focus:text-accent-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Easy</span>
                <span className="text-muted-foreground text-xs ml-auto">Beginner friendly</span>
              </div>
            </SelectItem>
            <SelectItem 
              value="Moderate" 
              className="focus:bg-accent focus:text-accent-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Moderate</span>
                <span className="text-muted-foreground text-xs ml-auto">Some experience needed</span>
              </div>
            </SelectItem>
            <SelectItem 
              value="Hard" 
              className="focus:bg-accent focus:text-accent-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Hard</span>
                <span className="text-muted-foreground text-xs ml-auto">Advanced concepts</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default TopicInput;
