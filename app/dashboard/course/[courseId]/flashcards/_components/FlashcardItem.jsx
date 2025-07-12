import React from "react";
import ReactCardFlip from "react-card-flip";

function FlashcardItem({ isFlipped, handleClick, flashcard }) {
  return (
    <div className="flex items-center justify-center mt-10">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        {/* Front side of the card */}
        <div>
          <h2
            className="p-4 bg-primary text-white flex items-center justify-center rounded-lg cursor-pointer shadow-lg h-[250px] w-[200px] md:h-[350px] md:w-[300px]"
            onClick={handleClick}
          >
            {flashcard?.front}
          </h2>
        </div>

        {/* Back side of the card */}
        <div>
          <h2
            className="p-4 bg-white shadow-lg text-primary flex items-center justify-center rounded-lg cursor-pointer h-[250px] w-[200px] md:h-[350px] md:w-[300px]"
            onClick={handleClick}
          >
            {flashcard?.back}
          </h2>
        </div>
      </ReactCardFlip>
    </div>
  );
}

export default FlashcardItem;
