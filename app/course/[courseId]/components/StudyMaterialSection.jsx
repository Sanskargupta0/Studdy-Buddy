// StudyMaterialSection.jsx
import React, { useEffect, useState } from "react";
import MaterialCardItem from "./MaterialCardItem"; // Make sure this path is correct
import axios from "axios";

const StudyMaterialSection = ({ courseId, course }) => {
  const [studyTypeContent, setStudyTypeContent] = useState();

  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read notes to prepare",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcards help to remember the concepts",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "Flashcard",
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/quiz.png",
      path: "/quiz",
      type: "Quiz",
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning",
      icon: "/qa.png",
      path: "/qa",
      type: "QA",
    },
  ];

  useEffect(() => {
    GetStudyMaterial();
  }, []);

  const GetStudyMaterial = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "ALL",
      });
      setStudyTypeContent(result?.data);
    } catch (error) {
      console.error("Error fetching study material:", error);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="font-medium text-2xl">Study Material</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-3">
        {MaterialList.map((item, index) => (
          <MaterialCardItem
            key={index}
            item={item}
            studyTypeContent={studyTypeContent}
            course={course}
            refreshData={GetStudyMaterial}
          />
        ))}
      </div>
    </div>
  );
};

export default StudyMaterialSection;
