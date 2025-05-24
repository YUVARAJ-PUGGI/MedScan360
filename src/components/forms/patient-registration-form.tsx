"use client";

import type { ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientRegistrationSchema, type PatientRegistrationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Camera, FileImage, Loader2 } from 'lucide-react';
import WebcamCapture from '@/components/core/webcam-capture';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function PatientRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facialImageFile, setFacialImageFile] = useState<File | null>(null);
  const [facialImagePreview, setFacialImagePreview] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const { toast } = useToast();

  const form = useForm<PatientRegistrationFormData>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      name: '',
      age: undefined,
      gender: undefined,
      bloodGroup: '',
      allergies: '',
      medicalConditions: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  });

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFacialImageFile(file);
      setFacialImagePreview(URL.createObjectURL(file));
      form.setValue('facialImage', file); // For RHF to know a file is selected
    }
  };

  const handleWebcamCapture = (imageSrc: string) => {
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "webcam-capture.png", { type: "image/png" });
        setFacialImageFile(file);
        setFacialImagePreview(imageSrc);
        form.setValue('facialImage', file);
        setShowWebcam(false);
      });
  };

  async function onSubmit(data: PatientRegistrationFormData) {
    setIsSubmitting(true);
    console.log("Patient Data:", data);
    console.log("Facial Image File:", facialImageFile);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would upload facialImageFile to storage
    // and save 'data' (with image URL) to Firestore.
    
    toast({
      title: "Registration Successful",
      description: `${data.name} has been registered.`,
      variant: "default",
    });
    form.reset();
    setFacialImageFile(null);
    setFacialImagePreview(null);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group *</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bloodGroups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Penicillin, Peanuts" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medicalConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Existing Medical Conditions</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Asthma, Diabetes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-semibold pt-4 border-t">Emergency Contact</h3>
         <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <h3 className="text-lg font-semibold pt-4 border-t">Facial Image</h3>
        <FormField
          control={form.control}
          name="facialImage"
          render={() => ( // We handle file input manually, not directly via RHF field
            <FormItem>
              <FormLabel>Upload Facial Image (Optional)</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleImageFileChange} className="mb-2" />
              </FormControl>
              <FormDescription>
                Alternatively, use webcam to capture an image.
              </FormDescription>
              <Dialog open={showWebcam} onOpenChange={setShowWebcam}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" onClick={() => setShowWebcam(true)}>
                    <Camera className="mr-2 h-4 w-4" /> Use Webcam
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Capture Facial Image</DialogTitle>
                  </DialogHeader>
                  {showWebcam && <WebcamCapture onCapture={handleWebcamCapture} onCancel={() => setShowWebcam(false)} />}
                </DialogContent>
              </Dialog>
              {facialImagePreview && (
                <div className="mt-4">
                  <img src={facialImagePreview} alt="Facial preview" className="w-32 h-32 rounded-md object-cover border" />
                </div>
              )}
              <FormMessage /> {/* For any general error on facialImage field */}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Register Patient"
          )}
        </Button>
      </form>
    </Form>
  );
}
