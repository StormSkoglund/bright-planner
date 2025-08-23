import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import About from "./pages/About";
import WeekPlanner from "./pages/WeekPlanner";
import WeekPlannerPrint from "./pages/WeekPlannerPrint";

export default function App() {
  return (
    <div>
      <Header />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/week-planner" element={<WeekPlanner />} />
          <Route path="/week-planner/print" element={<WeekPlannerPrint />} />
        </Routes>
      </main>
    </div>
  );
}
