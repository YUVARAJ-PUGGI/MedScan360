import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientList } from "@/components/dashboard/patient-list";
import { LocationMap } from "@/components/dashboard/location-map";
import { PatientDetailsView } from "@/components/dashboard/patient-details-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ListChecks, Map, UserCog } from "lucide-react";

// Mock patient data for the dashboard
const mockIncomingPatients = [
  { id: 'p1', name: 'John Smith', age: 45, condition: 'Chest Pains', eta: '5 mins', location: { lat: 34.0522, lng: -118.2437 } },
  { id: 'p2', name: 'Alice Johnson', age: 28, condition: 'Minor Lacerations', eta: '12 mins', location: { lat: 34.0550, lng: -118.2400 } },
  { id: 'p3', name: 'Robert Brown', age: 62, condition: 'Difficulty Breathing', eta: '8 mins', location: { lat: 34.0500, lng: -118.2450 } },
];

export default function DashboardPage() {
  // In a real app, patientId would come from selection in PatientList
  // For now, we can pick the first patient or leave it null.
  const selectedPatientForDetails = mockIncomingPatients[0] || null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Doctor Dashboard</CardTitle>
          </div>
          <CardDescription className="text-md">
            Overview of incoming patients, live locations, and patient management tools.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
            <ListChecks className="h-5 w-5" /> Patient Overview
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2 py-3">
            <Map className="h-5 w-5" /> Live Map
          </TabsTrigger>
           <TabsTrigger value="details" className="flex items-center gap-2 py-3 md:hidden"> {/* Show on mobile */}
            <UserCog className="h-5 w-5" /> Patient Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <PatientList patients={mockIncomingPatients} />
            </div>
            <div className="lg:col-span-2 hidden md:block"> {/* Hide on mobile, show on md+ */}
              <PatientDetailsView patient={selectedPatientForDetails} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <LocationMap initialPatients={mockIncomingPatients} />
        </TabsContent>
        
        <TabsContent value="details" className="mt-6 md:hidden"> {/* Show only on mobile */}
           <PatientDetailsView patient={selectedPatientForDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
