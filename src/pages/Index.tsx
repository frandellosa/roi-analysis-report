
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ComparisonTable from "@/components/ComparisonTable";
import ROICalculator from "@/components/ROICalculator";
import Timeline from "@/components/Timeline";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-shopify">
      <Navigation />
      <Hero />
      <Stats />
      <ComparisonTable />
      <ROICalculator />
      <Timeline />
    </div>
  );
};

export default Index;
