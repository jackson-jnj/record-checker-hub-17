
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { ScaleIn } from "@/components/animations/ScaleIn";

const Profile = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUploadClick = () => {
    setIsUploading(true);
    // Simulate upload delay for the animation
    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-police-dark">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your profile picture</p>
      </div>
      
      <ScaleIn delay={100}>
        <div className="grid grid-cols-1 gap-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-6">Your Profile</CardTitle>
              <div className="flex flex-col items-center">
                <Avatar className="h-36 w-36 mx-auto mb-4 border-4 border-white shadow-lg transition-all duration-300 hover:scale-105">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="text-3xl bg-police-dark text-white">{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mt-4">{user?.name || "User"}</h3>
                <p className="text-gray-500">{user?.email || "user@example.com"}</p>
                <p className="text-sm capitalize mt-2 px-3 py-1 bg-police-background rounded-full">
                  {user?.role || "User"}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  className="w-full transition-all duration-300 hover:bg-police-dark hover:text-white"
                  onClick={handleUploadClick}
                >
                  <Upload className={`mr-2 h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
                  {isUploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScaleIn>
    </div>
  );
};

export default Profile;
