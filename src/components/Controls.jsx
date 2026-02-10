import { useContext } from "react";
import GradesContext from "../store/grade-context";
import AddYearDialog from "./AddYearDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Controls = () => {
  const { clearAll } = useContext(GradesContext);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-wrap items-center justify-center  gap-2 w-full sm:w-auto">
        <AddYearDialog />
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive flex-1 sm:flex-none"
          title="Reset All Data"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>
    </div>
  );
};

export default Controls;
