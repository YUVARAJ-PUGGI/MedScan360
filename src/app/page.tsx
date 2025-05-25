
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Heart, ShieldCheck, UserPlus, Zap, LogIn, ArrowRight } from "lucide-react"; 
import Link from "next/link";
import Image from 'next/image'; // Added import
import { useAuth } from "@/context/AuthContext"; 
import { useRouter } from 'next/navigation'; 
import { useEffect } from 'react'; 

export default function HomePage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    // This content is usually not seen due to the redirect, but it's good practice to have a fallback.
    return (
      <div className="container mx-auto py-12 px-4 text-center min-h-screen flex items-center justify-center">
        <p className="text-xl">Redirecting to dashboard...</p>
      </div>
    );
  }

  const handleLogin = () => {
    login(); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <Image 
            src="https://placehold.co/150x150.png?text=PP" 
            alt="PulsePoint Logo" 
            width={120} 
            height={120} 
            className="mx-auto mb-8 rounded-full shadow-2xl border-4 border-white/80"
            data-ai-hint="medical logo"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Welcome to PulsePoint
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-10">
            Your comprehensive solution for emergency medical data management. Streamline patient care from first response to hospital admission.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-xl transform hover:scale-105 transition-transform duration-150 w-full sm:w-auto py-3 px-8"
              onClick={handleLogin}
            >
              <LogIn className="mr-2 h-5 w-5" /> Login to Access Platform
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/20 hover:text-white shadow-xl transform hover:scale-105 transition-transform duration-150 w-full sm:w-auto py-3 px-8"
              asChild
            >
              <Link href="/register">
                <UserPlus className="mr-2 h-5 w-5" /> Create New Patient Profile
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Overview Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-primary mb-4">
            Key Benefits for Your Team
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            PulsePoint is designed to enhance efficiency and accuracy in critical situations.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon={Zap}
              title="Rapid Identification"
              description="Swiftly identify patients using advanced (simulated) face scan technology, saving crucial seconds."
            />
            <BenefitCard
              icon={FileText}
              title="Centralized Records"
              description="Access and manage all patient information, from registration to emergency forms, in one secure place."
            />
            <BenefitCard
              icon={Heart}
              title="Enhanced Coordination"
              description="Improve team collaboration with shared access to vital patient data and (simulated) live location tracking."
            />
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <ShieldCheck className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-6">
            Ready to Streamline Your Workflow?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join other medical professionals who are enhancing their emergency response capabilities with PulsePoint.
          </p>
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl transform hover:scale-105 transition-transform duration-150 py-3 px-10"
            onClick={handleLogin}
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground border-t bg-background">
        <p>&copy; {new Date().getFullYear()} PulsePoint. Advanced Emergency Medical Systems. (Demo Application)</p>
      </footer>
    </div>
  );
}

interface BenefitCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
  return (
    <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <CardTitle className="text-xl font-semibold text-primary mb-2">{title}</CardTitle>
      <CardDescription className="text-base">{description}</CardDescription>
    </Card>
  );
}
