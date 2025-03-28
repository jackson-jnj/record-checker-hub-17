
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AtSign, Lock, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      // Navigate to the page user was trying to access, or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      setError((error as Error).message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we'll just show a message
    // In a real app, you would create a new user account
    setError("Signup feature is not implemented in this demo. Please use login.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-police-dark to-police-medium py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-police-dark" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-police-dark">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-1">
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
                </div>
                
                <div className="space-y-1">
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
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-police-dark hover:bg-police-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <p className="text-gray-500">
                  Demo credentials:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                  <div className="border rounded p-2">
                    <div className="font-semibold">Admin</div>
                    <div>admin@example.com</div>
                    <div>password</div>
                  </div>
                  <div className="border rounded p-2">
                    <div className="font-semibold">Applicant</div>
                    <div>applicant@example.com</div>
                    <div>password</div>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form className="mt-8 space-y-6" onSubmit={handleSignup}>
              {error && (
                <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="signupEmail">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="signupEmail" 
                      name="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="signupPassword">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="signupPassword" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full bg-police-dark hover:bg-police-medium">
                  Create Account
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-center text-sm">
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
