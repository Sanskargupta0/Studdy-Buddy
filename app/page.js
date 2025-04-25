import React from "react";
import { ArrowRight, BookOpen, Brain, FileText, Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button"

import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
          <span className="text-xl md:text-2xl font-bold">StuddyBuddy</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 md:px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg border border-gray-200 flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
          >
            <Github className="w-4 h-4 md:w-5 md:h-5" />
            <span>GitHub</span>
          </a>
          <Link href="/dashboard">
            <button className="px-3 md:px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-sm md:text-base">
              Dashboard
            </button>
          </Link>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-purple-50 to-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                  Transform Your Learning with{" "}
                  <span className="text-purple-600">AI-Powered</span> Study
                  Materials
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  StuddyBuddy generates personalized study materials tailored to
                  your learning style, saving you time and improving retention.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    See How It Works
                  </Button>
                </div>
                <div className="pt-4 text-sm text-gray-500">
                  No credit card required • Free plan available
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="AI Study Material Generator Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                    <span className="font-medium">
                      AI-generated in seconds!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Revolutionize Your Learning Experience
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our cutting-edge AI technology creates personalized study
                materials that adapt to your learning style.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="h-10 w-10 text-purple-600" />,
                  title: "Personalized Learning",
                  description:
                    "AI analyzes your learning style and creates materials tailored specifically to you.",
                },
                {
                  icon: <FileText className="h-10 w-10 text-purple-600" />,
                  title: "Multiple Formats",
                  description:
                    "Generate flashcards, summaries, practice tests, and more with a single click.",
                },
                {
                  icon: <BookOpen className="h-10 w-10 text-purple-600" />,
                  title: "Any Subject",
                  description:
                    "From mathematics to literature, our AI handles any subject with expert precision.",
                },
                {
                  icon: <Sparkles className="h-10 w-10 text-purple-600" />,
                  title: "Time-Saving",
                  description:
                    "Create weeks worth of study materials in minutes, not hours.",
                },
                {
                  icon: <ArrowRight className="h-10 w-10 text-purple-600" />,
                  title: "Progress Tracking",
                  description:
                    "Monitor your learning journey with detailed analytics and insights.",
                },
                {
                  icon: <Sparkles className="h-10 w-10 text-purple-600" />,
                  title: "Continuous Improvement",
                  description:
                    "Our AI learns from your feedback to create better materials over time.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How StuddyBuddy Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Generate personalized study materials in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Your Content",
                  description:
                    "Upload lecture notes, textbooks, or any learning material you want to study.",
                },
                {
                  step: "02",
                  title: "Select Your Format",
                  description:
                    "Choose from flashcards, summaries, practice tests, or custom formats.",
                },
                {
                  step: "03",
                  title: "Get Your Materials",
                  description:
                    "Receive AI-generated study materials tailored to your learning style.",
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-8 rounded-xl shadow-md h-full">
                    <div className="text-5xl font-bold text-purple-200 mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-purple-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of students and educators who have transformed
                their learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "StuddyBuddy helped me ace my finals. The personalized flashcards were exactly what I needed!",
                  name: "Sarah Johnson",
                  role: "Medical Student",
                },
                {
                  quote:
                    "As a teacher, this tool has saved me countless hours preparing study materials for my students.",
                  name: "Michael Chen",
                  role: "High School Teacher",
                },
                {
                  quote:
                    "The practice tests generated by StuddyBuddy perfectly matched my learning style. Highly recommend!",
                  name: "Emma Rodriguez",
                  role: "Computer Science Major",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl">
                  <div className="flex flex-col h-full">
                    <div className="mb-6 text-purple-600">{"★".repeat(5)}</div>
                    <p className="text-gray-700 italic mb-6 flex-grow">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-600">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join thousands of students and educators who are already using
              StuddyBuddy to create personalized study materials.
            </p>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-4 text-purple-200 text-sm">
              No credit card required • Free plan available
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-4">
                  StuddyBuddy
                </h3>
                <p className="mb-4 max-w-md">
                  AI-powered study material generator for students and
                  educators. Transform your learning experience today.
                </p>
                <div className="flex space-x-4">
                  {["Twitter", "Facebook", "Instagram", "LinkedIn"].map(
                    (social) => (
                      <a key={social} href="#" className="hover:text-white">
                        {social}
                      </a>
                    )
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Product
                </h4>
                <ul className="space-y-2">
                  {["Features", "Pricing", "Testimonials", "FAQ"].map(
                    (item) => (
                      <li key={item}>
                        <a href="#" className="hover:text-white">
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Company
                </h4>
                <ul className="space-y-2">
                  {["About", "Blog", "Careers", "Contact"].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-white">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
              <p>
                © {new Date().getFullYear()} StuddyBuddy. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
