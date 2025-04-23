
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [isLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary">Professor Planner</h1>
          <div className="space-x-2">
            {isLoggedIn ? (
              <Button asChild>
                <Link to="/dashboard" className="bg-primary hover:bg-primary/90">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register" className="bg-primary hover:bg-primary/90">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              The Ultimate Planning Tool for Professors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Stay organized with your classes, meetings, office hours, and research tasks - all in one place.
              Get timely email reminders and never miss an important event again.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
              <Link to={isLoggedIn ? "/dashboard" : "/register"}>Get Started</Link>
            </Button>
          </div>
        </section>

        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-secondary mb-12">
              Designed for Academic Professionals
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Schedule Management</h3>
                  <p className="text-gray-600 text-center">
                    Easily organize your teaching schedule, office hours, meetings, and academic events.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Task Tracking</h3>
                  <p className="text-gray-600 text-center">
                    Keep track of your research tasks, administrative duties, and academic deadlines.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"></path>
                      <path d="M5 14.5V14a7 7 0 0 1 14 0v.5"></path>
                      <path d="M8 18h8"></path>
                      <path d="M12 22v-4"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Email Reminders</h3>
                  <p className="text-gray-600 text-center">
                    Receive timely email notifications for upcoming classes, meetings, and task deadlines.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-secondary mb-6">
              Ready to Streamline Your Academic Schedule?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of professors who use Professor Planner to stay organized and productive.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
              <Link to={isLoggedIn ? "/dashboard" : "/register"}>Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-secondary text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Professor Planner</h3>
              <p className="text-gray-300">
                The ultimate scheduling and task management tool for academic professionals.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-300 hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="text-gray-300 hover:text-white">Register</Link></li>
                <li><a href="#features" className="text-gray-300 hover:text-white">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <p className="text-gray-300">
                Have questions? Reach out to our support team at support@professorplanner.com
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Professor Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
