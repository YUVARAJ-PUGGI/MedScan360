"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Ban, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel?: () => void;
  captureButtonText?: string;
  cancelButtonText?: string;
}

export default function WebcamCapture({
  onCapture,
  onCancel,
  captureButtonText = "Capture Photo",
  cancelButtonText = "Cancel"
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function setupWebcam() {
      setIsLoading(true);
      setError(null);
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error accessing webcam.";
        setError(`Error accessing webcam: ${errorMessage}. Please ensure permissions are granted.`);
        toast({
          title: "Webcam Error",
          description: `Could not access webcam: ${errorMessage}. Please check permissions.`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    setupWebcam();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/png');
        onCapture(imageSrc);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 h-64 bg-muted rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Initializing webcam...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md text-center">
        <p>{error}</p>
        {onCancel && (
           <Button onClick={onCancel} variant="outline" className="mt-4">
             {cancelButtonText}
           </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-2 border rounded-lg bg-card">
      <div className="relative w-full max-w-md aspect-video bg-black rounded-md overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          onLoadedData={() => setIsLoading(false)} // Second check for loading
        />
        {isLoading && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
             <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
             <p className="text-white">Loading video stream...</p>
           </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="flex space-x-3">
        {onCancel && (
          <Button onClick={onCancel} variant="outline">
            <Ban className="mr-2 h-4 w-4" />
            {cancelButtonText}
          </Button>
        )}
        <Button onClick={handleCapture} disabled={isLoading}>
          <Camera className="mr-2 h-4 w-4" />
          {captureButtonText}
        </Button>
      </div>
    </div>
  );
}
