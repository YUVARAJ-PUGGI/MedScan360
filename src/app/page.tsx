import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ScanFace, UserPlus, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const features = [
    {
      title: "Patient Registration",
      description: "Quickly register new patients with essential medical details and facial image.",
      icon: UserPlus,
      href: "/register",
      cta: "Register Patient",
      img: "https://placehold.co/600x400.png",
      aiHint: "patient registration"
    },
    {
      title: "Facial Recognition Scan",
      description: "Ambulance staff can swiftly identify patients using live facial scanning technology.",
      icon: ScanFace,
      href: "/face-scan",
      cta: "Scan Face",
      img: "https://placehold.co/600x400.png",
      aiHint: "facial recognition"
    },
    {
      title: "Doctor Dashboard",
      description: "Monitor incoming emergencies, track ambulance locations, and access patient data.",
      icon: LayoutDashboard,
      href: "/dashboard",
      cta: "Go to Dashboard",
      img: "https://placehold.co/600x400.png",
      aiHint: "medical dashboard"
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-primary mb-6">
          Welcome to PulsePoint
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Revolutionizing emergency medical response with cutting-edge technology for faster, more accurate patient care.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-56 w-full">
              <Image 
                src={feature.img} 
                alt={feature.title} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={feature.aiHint}
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="w-8 h-8 text-accent" />
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-base min-h-[3em]">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={feature.href}>{feature.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="bg-card p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-semibold text-primary mb-4">Empowering First Responders</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          PulsePoint provides critical information at your fingertips, ensuring that every second counts in an emergency.
          Our integrated system connects registration, identification, and real-time data for optimal patient outcomes.
        </p>
      </section>
    </div>
  );
}
