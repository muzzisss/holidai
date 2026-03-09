import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Flights from "@/pages/Flights";
import Hotels from "@/pages/Hotels";
import Packages from "@/pages/Packages";
import Activities from "@/pages/Activities";
import AIPlanner from "@/pages/AIPlanner";
import Budget from "@/pages/Budget";
import Itineraries from "@/pages/Itineraries";
import Destinations from "@/pages/Destinations";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/itineraries" element={<Itineraries />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
