"use client"

import React from "react";
import { ArrowRight, BookOpen, Brain, FileText, Sparkles, Github, Menu, X, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  const { isSignedIn } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Image src={"/logo.svg"} alt="logo" width={32} height={32} className="h-8 w-auto" />
                <span className="ml-2 text-xl font-bold text-gray-900">StuddyBuddy</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#features" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  How It Works
                </a>
                <a href="#testimonials" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Testimonials
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <a
                href="https://github.com/Sanskargupta0/Studdy-Buddy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <Github className="h-4 w-4 mr-2" />
                <span>GitHub</span>
              </a>
              {!isSignedIn ? (
                <div className="flex space-x-3">
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard" >
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                      Dashboard
                    </button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500" aria-expanded="false" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1 bg-white">
            <a href="#features" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
              Features
            </a>
            <a href="#how-it-works" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
              How It Works
            </a>
            <a href="#testimonials" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
              Testimonials
            </a>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4 space-x-3">
                <a
                  href="https://github.com/yourusername/studdy-buddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Github className="h-4 w-4 mr-2" />
                  <span>GitHub</span>
                </a>
                <Link href="/dashboard" className="w-full">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                    Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-purple-50 to-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                  Create Perfect Study Materials
                  <span className="text-purple-600 block">In Seconds</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Just type your content, select difficulty level, and let our AI create
                  personalized study materials to boost your learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Start Creating Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline">
                      Try for Free
                    </Button>
                  </Link>
                </div>
                <div className="pt-4 text-sm text-gray-500">
                  No credit card required • Start learning effectively today
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src="/image.png"
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
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Create your perfect study materials in just three easy steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Enter Your Content",
                  description:
                    "Type or paste your study material, notes, or any text you want to learn from.",
                },
                {
                  step: "02",
                  title: "Set Difficulty Level",
                  description:
                    "Choose the complexity level that matches your current understanding.",
                },
                {
                  step: "03",
                  title: "Generate & Learn",
                  description:
                    "Get instant, personalized study materials optimized for your needs.",
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
        <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
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
              Ready to Study Smarter?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join students who are already learning more effectively with
              AI-generated study materials.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-4 text-purple-200 text-sm">
              No credit card required • Start for free
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        
            <div className="border-gray-800 text-sm text-center text-gray-400">
              <p>
                {new Date().getFullYear()} StuddyBuddy. All rights reserved.
              </p>
            </div>
          
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
