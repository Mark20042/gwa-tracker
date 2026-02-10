import { useContext } from "react";
import GradeProvider from "./store/grade-provider";
import GradesContext from "./store/grade-context";
import { Toaster } from "sonner";
import Header from "./components/Header";
import Controls from "./components/Controls";
import YearList from "./components/YearList";


const GwaDashboard = () => {
  // ... existing hooks
  const { getOverallGWA } = useContext(GradesContext);

  const overallGwa = getOverallGWA();

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />

      {/* Fixed Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 md:py-4 space-y-3 md:space-y-4">
          <Header overallGwa={overallGwa} />
          <Controls />
        </div>
      </div>

      {/* Main Content: Year List */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-[260px] md:pt-[220px] pb-8 space-y-6">
        <YearList />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <GradeProvider>
      <GwaDashboard />
    </GradeProvider>
  );
};

export default App;
