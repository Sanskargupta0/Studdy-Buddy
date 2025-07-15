export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "StuddyBuddy",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "description": "Create personalized study materials with AI. Generate flashcards, notes, quizzes, and Q&A sessions in minutes.",
    "url": process.env.HOST_URL || "https://studdy-buddy.vercel.app",
    "author": {
      "@type": "Organization",
      "name": "StuddyBuddy Team"
    },
    "offers": {
      "@type": "Offer",
      "category": "Free",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "100"
    },
    "features": [
      "AI-powered study material generation",
      "Flashcard creation",
      "Quiz generation",
      "Note taking",
      "Q&A sessions",
      "Personalized learning"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
