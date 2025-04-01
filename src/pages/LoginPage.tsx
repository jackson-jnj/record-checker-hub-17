
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AtSign, Lock, Eye, EyeOff, ChevronLeft, User, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated } = useAuth();
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nrc, setNrc] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");

  // Get the from path from location state, or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Check URL for tab parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam === "signup") {
      setActiveTab("signup");
    }
  }, [location]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Navigate handled by useEffect watching isAuthenticated
    } catch (error) {
      setError((error as Error).message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form fields
    if (!signupEmail || !signupPassword || !confirmPassword || !firstName || !lastName) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(signupEmail, signupPassword, firstName, lastName, nrc);
      // Set message instead of redirecting immediately as Supabase might require email confirmation
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials.",
      });
      // Switch to login tab
      setActiveTab("login");
    } catch (error) {
      setError((error as Error).message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-police-dark to-police-medium py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
            className="absolute left-0 top-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </motion.button>
          
          <motion.div className="flex justify-center" variants={itemVariants}>
            <Shield className="h-12 w-12 text-police-dark" />
          </motion.div>
          <motion.h2 className="mt-6 text-3xl font-extrabold text-police-dark" variants={itemVariants}>
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-600" variants={itemVariants}>
            {activeTab === "login" 
              ? "Enter your credentials to access your account" 
              : "Fill in your details to create a new account"}
          </motion.p>
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 p-4 rounded-md border border-red-200 text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-4">
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </motion.div>
                
                <motion.div className="space-y-1" variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button 
                      type="button"
                      className="text-sm font-medium text-police-accent hover:text-police-accent/80"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10" 
                      required 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-police-dark hover:bg-police-medium text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </motion.div>
              
              <motion.div 
                className="text-center text-sm"
                variants={itemVariants}
              >
                <p className="text-gray-500">
                  Demo credentials:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                  <div className="border rounded p-2">
                    <div className="font-semibold">Admin</div>
                    <div>admin@example.com</div>
                    <div>password: password</div>
                  </div>
                  <div className="border rounded p-2">
                    <div className="font-semibold">Applicant</div>
                    <div>applicant@example.com</div>
                    <div>password: password</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div className="border rounded p-2">
                    <div className="font-semibold">Officer</div>
                    <div>officer@example.com</div>
                    <div>password: password</div>
                  </div>
                  <div className="border rounded p-2">
                    <div className="font-semibold">Verifier</div>
                    <div>verifier@example.com</div>
                    <div>password: password</div>
                  </div>
                </div>
              </motion.div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form className="mt-8 space-y-6" onSubmit={handleSignup}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 p-4 rounded-md border border-red-200 text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-4">
                <motion.div 
                  className="grid grid-cols-2 gap-4"
                  variants={itemVariants}
                >
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name*</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label htmlFor="signupEmail">Email*</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="signupEmail" 
                      name="email" 
                      type="email" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="your@email.com" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </motion.div>
                
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label htmlFor="nrc">NRC (National Registration Card)</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="nrc" 
                      name="nrc"
                      value={nrc}
                      onChange={(e) => setNrc(e.target.value)}
                      placeholder="999999/99/1" 
                      className="pl-10"
                    />
                  </div>
                </motion.div>
                
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label htmlFor="signupPassword">Password*</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="signupPassword" 
                      name="password" 
                      type={showSignupPassword ? "text" : "password"} 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10" 
                      required 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                </motion.div>
                
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label htmlFor="confirmPassword">Confirm Password*</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10" 
                      required 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full bg-police-dark hover:bg-police-medium text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </motion.div>
            </form>
          </TabsContent>
        </Tabs>
        
        <motion.div 
          className="mt-4 text-center text-sm"
          variants={itemVariants}
        >
          <p className="text-gray-600">
            By using this service, you agree to our{" "}
            <a href="#" className="font-medium text-police-accent hover:text-police-accent/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-police-accent hover:text-police-accent/80">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
