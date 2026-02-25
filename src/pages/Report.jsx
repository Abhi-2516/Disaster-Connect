import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CheckCircle, 
  Clipboard, 
  Info, 
  MapPin, 
  Upload,
  X // Added for close button
} from 'lucide-react';
// TypeScript types (IncidentType, Severity) are removed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useIncidentStore } from '@/lib/store';

const Report = () => {
  const navigate = useNavigate();
  const { addIncident } = useIncidentStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // All type casting removed from formData
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    severity: '',
    location: {
      lat: 0,
      lng: 0,
      address: '',
    },
    imageFile: null,
    imagePreview: '',
  });

  // Handle input changes (event types removed)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select changes (param types removed)
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload (event type removed)
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result, // Type cast removed
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Getting current location with high accuracy
  const getCurrentLocation = () => {
    toast.promise(
      new Promise((resolve, reject) => { // Added reject
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData({
              ...formData,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: 'Your current location', // Mock address, in a real app you'd reverse geocode
              }
            });
            resolve();
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error(`Failed to get location: ${error.message}`);
            reject(error);
          },
          { 
            enableHighAccuracy: true, // Added for better accuracy
            timeout: 10000,
            maximumAge: 0
          }
        );
      }),
      {
        loading: 'Getting your location...',
        success: 'Location found!',
        error: (err) => `Failed to get location: ${err.message}`, // Pass error message
      }
    );
  };

  // Handle form submission (event type removed)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.type || !formData.severity) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (formData.location.lat === 0 && formData.location.lng === 0) {
      toast.error('Please set your location');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new incident from form data
    const newIncident = {
      // id, timestamp, and verified will be set by the store
      title: formData.title,
      description: formData.description,
      type: formData.type,
      severity: formData.severity,
      location: formData.location,
      imageUrl: formData.imagePreview || undefined,
    };
    
    // Add to store
    addIncident(newIncident);
    
    toast.success('Your report has been submitted!');
    
    // Navigate to home page after short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Next step
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // Previous step
  const goToPreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Validate current step
  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.description) {
        toast.error('Please fill in all required fields');
        return false;
      }
    } else if (step === 2) {
      if (!formData.type || !formData.severity) {
        toast.error('Please select incident type and severity');
        return false;
      }
    } else if (step === 3) {
      if (formData.location.lat === 0 && formData.location.lng === 0) {
        toast.error('Please set your location');
        return false;
      }
    }
    return true;
  };

  // Helper for styling inputs
  const inputStyles = "bg-slate-800/60 border-slate-700/80 rounded-lg placeholder:text-slate-400 focus:bg-slate-800 focus:border-primary focus:ring-primary text-slate-200";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container max-w-2xl mx-auto">
          {/* Progress Steps (Restyled for dark) */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center z-10">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 transition-all font-semibold ${
                      i < step 
                        ? 'bg-primary text-primary-foreground' 
                        : i === step 
                          ? 'bg-primary/20 border-2 border-primary text-primary' 
                          : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {i < step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span>{i}</span>
                    )}
                  </div>
                  <div className={`text-xs ${i === step ? 'text-slate-200' : 'text-slate-400'}`}>
                    {i === 1 ? 'Details' : i === 2 ? 'Type' : i === 3 ? 'Location' : 'Review'}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="relative mt-[-2.3rem] h-1 bg-slate-700">
              <div 
                className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300" 
                style={{ width: `${((step - 1) / 3) * 100}%` }} 
              />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="animate-fade-in">
            {/* Base Card for all steps */}
            <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 text-slate-200 shadow-xl">
              
              {/* Step 1: Incident Details */}
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-white">Incident Details</CardTitle>
                    <CardDescription className="text-slate-400">
                      Provide basic information about the incident
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., Wildfire near Hill Valley"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={inputStyles}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description <span className="text-red-400">*</span>
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe what's happening, conditions, and other relevant details"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        required
                        className={inputStyles}
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end border-t border-slate-700/60 pt-4">
                    <Button type="button" onClick={goToNextStep}>
                      Next Step
                    </Button>
                  </CardFooter>
                </>
              )}
              
              {/* Step 2: Incident Type */}
              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-white">Incident Classification</CardTitle>
                    <CardDescription className="text-slate-400">
                      Categorize the incident to help others
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium">
                        Incident Type <span className="text-red-400">*</span>
                      </label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger id="type" className={inputStyles}>
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flood">Flood</SelectItem>
                          <SelectItem value="fire">Fire</SelectItem>
                          <SelectItem value="earthquake">Earthquake</SelectItem>
                          <SelectItem value="hurricane">Hurricane</SelectItem>
                          <SelectItem value="tornado">Tornado</SelectItem>
                          <SelectItem value="landslide">Landslide</SelectItem>
                          <SelectItem value="tsunami">Tsunami</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="severity" className="text-sm font-medium">
                        Severity Level <span className="text-red-400">*</span>
                      </label>
                      <Select
                        value={formData.severity}
                        onValueChange={(value) => handleSelectChange('severity', value)}
                      >
                        <SelectTrigger id="severity" className={inputStyles}>
                          <SelectValue placeholder="Select severity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Minor incident</SelectItem>
                          <SelectItem value="medium">Medium - Significant impact</SelectItem>
                          <SelectItem value="high">High - Major emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="image" className="text-sm font-medium">
                        Upload Image (Optional)
                      </label>
                      <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center bg-slate-800/30">
                        {formData.imagePreview ? (
                          <div className="space-y-4">
                            <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg">
                              <img 
                                src={formData.imagePreview} 
                                alt="Preview" 
                                className="w-full h-auto"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm h-7 w-7 p-0"
                                onClick={() => setFormData({
                                  ...formData,
                                  imageFile: null,
                                  imagePreview: '',
                                })}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-slate-400">
                              Click the <X className="inline h-3 w-3" /> to remove this image
                            </p>
                          </div>
                        ) : (
                          <>
                            <Camera className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                            <p className="text-sm text-slate-400 mb-4">
                              Drag and drop an image, or click to browse
                            </p>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white"
                              onClick={() => document.getElementById('image')?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t border-slate-700/60 pt-4">
                    <Button type="button" variant="outline" onClick={goToPreviousStep} className="text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white">
                      Previous Step
                    </Button>
                    <Button type="button" onClick={goToNextStep}>
                      Next Step
                    </Button>
                  </CardFooter>
                </>
              )}
              
              {/* Step 3: Location */}
              {step === 3 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-white">Incident Location</CardTitle>
                    <CardDescription className="text-slate-400">
                      Tell us where this incident is happening
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="flex justify-between mb-6">
                      <Button 
                        type="button" 
                        onClick={getCurrentLocation}
                        className="w-full"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Use My Current Location
                      </Button>
                    </div>
                    
                    {formData.location.address && (
                      <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-l-primary animate-slide-in-right">
                        <div className="flex items-start">
                          <MapPin className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-slate-200 mb-1">Location detected</p>
                            <p className="text-sm text-slate-400 mb-2">
                              {formData.location.address}
                            </p>
                            <div className="text-xs text-slate-500">
                              Coordinates: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Address (Optional)
                      </label>
                      <Textarea
                        id="address"
                        name="location.address"
                        placeholder="Or, enter the address or location description"
                        value={formData.location.address}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, address: e.target.value }
                        })}
                        rows={3}
                        className={inputStyles}
                      />
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60">
                      <div className="flex items-start">
                        <Info className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                        <p className="text-sm text-slate-400">
                          In a real app, a map would be displayed here to drag a pin
                          for the exact incident location.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t border-slate-700/60 pt-4">
                    <Button type="button" variant="outline" onClick={goToPreviousStep} className="text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white">
                      Previous Step
                    </Button>
                    <Button type="button" onClick={goToNextStep}>
                      Review Report
                    </Button>
                  </CardFooter>
                </>
              )}
              
              {/* Step 4: Review and Submit */}
              {step === 4 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-white">Review Your Report</CardTitle>
                    <CardDescription className="text-slate-400">
                      Please verify the information before submitting
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Review Section: Details */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                        <h3 className="font-medium text-slate-200">Incident Details</h3>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-primary hover:text-primary"
                          onClick={() => setStep(1)}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-400">Title</h4>
                        <p className="text-sm text-slate-200">{formData.title}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-400">Description</h4>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{formData.description}</p>
                      </div>
                    </div>
                    
                    {/* Review Section: Classification */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                        <h3 className="font-medium text-slate-200">Classification</h3>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-primary hover:text-primary"
                          onClick={() => setStep(2)}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-400">Type</h4>
                          <p className="text-sm text-slate-200 capitalize">{formData.type}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-400">Severity</h4>
                          <p className="text-sm text-slate-200 capitalize">{formData.severity}</p>
                        </div>
                      </div>
                      {formData.imagePreview && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-400">Image</h4>
                          <div className="rounded-lg overflow-hidden max-w-xs border border-slate-700/60">
                            <img src={formData.imagePreview} alt="Incident" className="w-full h-auto"/>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Review Section: Location */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                        <h3 className="font-medium text-slate-200">Location</h3>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-primary hover:text-primary"
                          onClick={() => setStep(3)}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-400">Address</h4>
                        <p className="text-sm text-slate-200">{formData.location.address || 'Not provided'}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-400">Coordinates</h4>
                        <p className="text-sm text-slate-200">{formData.location.lat}, {formData.location.lng}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60">
                      <div className="flex items-start">
                        <Info className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                        <p className="text-sm text-slate-400">
                          By submitting this report, you confirm that the information provided is accurate 
                          to the best of your knowledge.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                
                  <CardFooter className="flex justify-between border-t border-slate-700/60 pt-4">
                    <Button type="button" variant="outline" onClick={goToPreviousStep} className="text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white">
                      Previous Step
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="min-w-32"
                    >
                      {isSubmitting ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Clipboard className="mr-2 h-4 w-4" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
