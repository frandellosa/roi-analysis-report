
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ComparisonTable from "@/components/ComparisonTable";
import ROICalculator from "@/components/ROICalculator";
import Timeline from "@/components/Timeline";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-shopify">
      <Navigation />
      <Hero />
      <Stats />
      <Separator className="max-w-7xl mx-auto my-6 bg-gray-200" />
      <ComparisonTable />
      <ROICalculator />
      <Footer />
    </div>
  );
};

export default Index;
