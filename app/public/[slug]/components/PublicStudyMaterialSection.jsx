import React from "react";
import Link from "next/link";

const PublicStudyMaterialSection = ({ courseId, course }) => {
  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read notes to prepare",
      icon: "/notes.png",
      path: `/public/${course?.publicSlug}/notes`,
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcards help to remember the concepts",
      icon: "/flashcard.png",
      path: `/public/${course?.publicSlug}/flashcards`,
      type: "Flashcard",
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/quiz.png",
      path: `/public/${course?.publicSlug}/quiz`,
      type: "Quiz",
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning",
      icon: "/qa.png",
      path: `/public/${course?.publicSlug}/qa`,
      type: "QA",
    },
  ];

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Study Materials</h2>
        <p className="text-muted-foreground mt-1">
          Different ways to study this course content
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MaterialList.map((item, index) => (
          <PublicMaterialCardItem
            key={index}
            item={item}
            courseId={courseId}
            course={course}
          />
        ))}
      </div>
    </div>
  );
};

const PublicMaterialCardItem = ({ item, courseId, course }) => {
  return (
    <Link href={item.path}>
      <div className="border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-card">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
            <img 
              src={item.icon} 
              alt={item.name}
              className="w-10 h-10 object-contain"
            />
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </div>
          
          <div className="w-full pt-2">
            <div className="text-xs text-primary font-medium">
              View Material →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublicStudyMaterialSection;
