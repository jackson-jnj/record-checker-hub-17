import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, FileText, Upload } from "lucide-react";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    applicationType: "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: user?.email || "",
    identificationType: "",
    identificationNumber: "",
    purpose: "",
    agreeToTerms: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files as FileList)]);
    }
  };
  
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return !!formData.applicationType;
      case 2:
        return (
          !!formData.firstName &&
          !!formData.lastName &&
          !!formData.dateOfBirth &&
          !!formData.address &&
          !!formData.city &&
          !!formData.state &&
          !!formData.zipCode &&
          !!formData.phoneNumber &&
          !!formData.email
        );
      case 3:
        return (
          !!formData.identificationType &&
          !!formData.identificationNumber &&
          !!formData.purpose
        );
      default:
        return true;
    }
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully. Reference number: PRC-" + Date.now(),
      });
      setIsSubmitting(false);
      navigate("/applications");
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8">
        <Button variant="outline" className="mb-4" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold text-police-dark">New Application</h1>
        <p className="text-gray-500 mt-1">Submit a new police record check request</p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center text-white ${step >= 1 ? 'bg-police-dark' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-police-dark' : 'bg-gray-300'}`}></div>
          </div>
          <div className="flex items-center">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center text-white ${step >= 2 ? 'bg-police-dark' : 'bg-gray-300'}`}>
              2
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-police-dark' : 'bg-gray-300'}`}></div>
          </div>
          <div className="flex items-center">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center text-white ${step >= 3 ? 'bg-police-dark' : 'bg-gray-300'}`}>
              3
            </div>
            <div className={`h-1 w-16 ${step >= 4 ? 'bg-police-dark' : 'bg-gray-300'}`}></div>
          </div>
          <div className="flex items-center">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center text-white ${step >= 4 ? 'bg-police-dark' : 'bg-gray-300'}`}>
              4
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <div className={step >= 1 ? 'text-police-dark font-medium' : ''}>Type</div>
          <div className={step >= 2 ? 'text-police-dark font-medium' : ''}>Personal Info</div>
          <div className={step >= 3 ? 'text-police-dark font-medium' : ''}>Details</div>
          <div className={step >= 4 ? 'text-police-dark font-medium' : ''}>Review</div>
        </div>
      </div>
      
      <Card className="mb-8">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Application Type</CardTitle>
              <CardDescription>
                Select the type of police record check you need
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="applicationType">Check Type</Label>
                <Select
                  value={formData.applicationType}
                  onValueChange={(value) => 
                    setFormData({ ...formData, applicationType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a check type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Check</SelectItem>
                    <SelectItem value="enhanced">Enhanced Check</SelectItem>
                    <SelectItem value="vulnerable">Vulnerable Sector Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="standard">
                  <AccordionTrigger>What is a Standard Check?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-600">
                      A Standard Check includes criminal convictions, findings of guilt, and summary convictions for the past five years.
                      This is typically used for employment, volunteer positions, or general background checks.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Processing time:</strong> 5-7 business days
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Fee:</strong> k300.00
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="enhanced">
                  <AccordionTrigger>What is an Enhanced Check?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-600">
                      An Enhanced Check includes all the information in a Standard Check, plus outstanding charges, warrants, judicial orders,
                      peace bonds, probation and prohibition orders. This is typically used for positions of authority or trust.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Processing time:</strong> 7-10 business days
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Fee:</strong> k450.00
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="vulnerable">
                  <AccordionTrigger>What is a Vulnerable Sector Check?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-600">
                      A Vulnerable Sector Check includes all the information in an Enhanced Check, plus sexual offences, pardoned criminal convictions,
                      and additional information. This is required for positions working with vulnerable populations such as children, elderly, or persons with disabilities.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Processing time:</strong> 10-15 business days
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Fee:</strong> k550.00
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </>
        )}
        
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Provide your personal details for the record check
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </>
        )}
        
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Provide additional details and upload required documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identificationType">ID Type</Label>
                  <Select
                    value={formData.identificationType}
                    onValueChange={(value) => 
                      setFormData({ ...formData, identificationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driver_license">Driver's License</SelectItem>
                      <SelectItem value="nrc">NRC</SelectItem>
                      <SelectItem value="other">Other Government ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identificationNumber">ID Number</Label>
                  <Input
                    id="identificationNumber"
                    name="identificationNumber"
                    value={formData.identificationNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Record Check</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => 
                    setFormData({ ...formData, purpose: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="volunteer">Volunteer Work</SelectItem>
                    <SelectItem value="education">Education/Training</SelectItem>
                    <SelectItem value="licensing">Professional Licensing</SelectItem>
                    <SelectItem value="immigration">Immigration/Visa</SelectItem>
                    <SelectItem value="adoption">Adoption</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Upload Required Documents</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Upload copies of your ID and any other required documents
                    </p>
                    <label htmlFor="file-upload" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-police-dark hover:bg-police-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-police-dark cursor-pointer">
                      Select Files
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files</Label>
                  <div className="border rounded-md divide-y">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
        
        {step === 4 && (
          <>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Review your application details before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Application Type</h3>
                  <p className="capitalize">{formData.applicationType} Check</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p>{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p>{formData.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p>{formData.email} | {formData.phoneNumber}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">Application Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Identification</p>
                      <p className="capitalize">{formData.identificationType?.replace('_', ' ')} ({formData.identificationNumber})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Purpose</p>
                      <p className="capitalize">{formData.purpose?.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">Documents</h3>
                  {files.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {files.map((file, index) => (
                        <li key={index} className="text-sm">{file.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  className="mt-1"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I confirm that the information provided is accurate and complete. I understand that providing false information may result in the rejection of my application or other legal consequences.
                </Label>
              </div>
            </CardContent>
          </>
        )}
        
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={nextStep} className="ml-auto">
              Continue
            </Button>
          ) : (
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
              <AlertDialogTrigger asChild>
                <Button
                  className="ml-auto"
                  disabled={!formData.agreeToTerms || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to submit this application? Once submitted, you won't be able to edit it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApplicationForm;
