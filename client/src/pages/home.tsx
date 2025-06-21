import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Palette, Sparkles, Target, ImageIcon, Lightbulb } from "lucide-react";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="bg-white/90 backdrop-blur-sm">
        <Header 
          currentPage="home" 
          icon={<Palette className="text-white text-lg" />}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Spark your creativity with Limochi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're looking for fresh ideas or ready to take on a challenge, Limochi provides personalized art prompts with inspiring reference photos to fuel your creative journey.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Idea Generation Card */}
          <Card className="p-8 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Idea Generation</h3>
              <p className="text-gray-600 mb-6">
                Looking for inspiration? Select your skill level, choose categories that interest you, and pick a mood. 
                Get personalized art ideas that match your preferences perfectly.
              </p>
              <ul className="text-sm text-gray-500 mb-6 space-y-2">
                <li>• Choose your skill level</li>
                <li>• Select favorite categories</li>
                <li>• Pick a mood or go random</li>
                <li>• Get tailored creative ideas</li>
              </ul>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => window.location.href = '/idea-generation'}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Let's explore!
              </Button>
            </div>
          </Card>

          {/* Challenge Card */}
          <Card className="p-8 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Take a Challenge</h3>
              <p className="text-gray-600 mb-6">
                Ready to push your boundaries? Select your skill level and receive a complete creative challenge with random elements to expand your artistic horizons.
              </p>
              <ul className="text-sm text-gray-500 mb-6 space-y-2">
                <li>• Choose your skill level</li>
                <li>• Get random creative constraints</li>
                <li>• Push your artistic boundaries</li>
                <li>• Complete surprise challenges</li>
              </ul>
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={() => window.location.href = '/challenge'}
              >
                <Target className="mr-2 h-4 w-4" />
                Start Challenge!
              </Button>
            </div>
          </Card>
        </div>

        {/* Gallery Section */}
        <section className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="max-w-2xl mx-auto px-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Visual Inspiration</h3>
            <p className="text-gray-600 mb-6">
              Already have an idea but still unsure where to start? Browse through our curated collection of reference photos and visual inspiration. Search for specific themes or discover new artistic directions.
            </p>
            <Button 
              variant="outline" 
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => window.location.href = '/gallery'}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Browse Gallery
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white text-sm" />
                </div>
                <span className="font-bold text-gray-900">Limochi</span>
              </div>
              <p className="text-gray-600 mb-4">Generate personalized art prompts and beautiful visual inspiration.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors">Art Prompt Generator</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Reference Gallery</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Style Filters</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Save Collections</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 mt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 Art Prompt Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}