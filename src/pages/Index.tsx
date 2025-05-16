
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Clock, FileText, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-police-dark to-police-medium">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-16 sm:py-24">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/">
              <Shield className="h-20 w-20 text-white hover:scale-105 transition-transform" />
            </Link>
          </motion.div>
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Police Record Check GRZ
          </motion.h1>
          <motion.p 
            className="mt-6 max-w-2xl mx-auto text-xl text-white/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            A secure and streamlined system for tracking and managing police record check applications.
          </motion.p>
          <motion.div 
            className="mt-10 flex justify-center gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-police-dark hover:bg-gray-100" 
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-police-light border-white hover:bg-white/10"
              asChild
            >
              <Link to="/login?tab=signup">Create Account</Link>
            </Button>
          </motion.div>
        </div>

        {/* Features */}
        <div className="py-12 bg-white rounded-lg shadow-xl mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-police-dark sm:text-4xl">
                Streamlined Application Process
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Our system simplifies the entire process from application to approval.
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-police-accent rounded-md shadow-lg">
                          <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Application</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Submit your application online with a simple step-by-step process.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-police-accent rounded-md shadow-lg">
                          <Clock className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Real-time Tracking</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Track your application status in real-time with detailed updates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-police-accent rounded-md shadow-lg">
                          <UserCheck className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure Verification</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Advanced security measures to protect your sensitive information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-police-accent rounded-md shadow-lg">
                          <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Fast Results</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Receive your results faster with our efficient processing system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl mt-12 py-12 px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-white/80">
            Create an account today and submit your police record check application.
          </p>
          <div className="mt-8">
            <Button 
              size="lg" 
              className="bg-white text-police-dark hover:bg-gray-100 font-semibold" 
              asChild
            >
              <Link to="/login?tab=signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-police-dark py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Link to="/">
                <Shield className="h-8 w-8 text-white hover:scale-110 transition-transform" />
              </Link>
              <span className="ml-2 text-white font-bold">Police Record Check</span>
            </div>
            <div className="mt-4 md:mt-0 text-white/70 text-sm">
              © {new Date().getFullYear()} Police Record Check System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
