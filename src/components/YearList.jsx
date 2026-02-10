import { useContext } from "react";
import GradesContext from "../store/grade-context";
import YearCard from "./YearCard";
import { Plus } from "lucide-react";

const YearList = () => {
    const { years } = useContext(GradesContext);

    if (years.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                    No years added yet
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                    Start by adding a year level using the dropdown above.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {years
                .sort((a, b) => a.level.localeCompare(b.level))
                .map((year) => (
                    <YearCard key={year.id} year={year} />
                ))}
        </div>
    );
};

export default YearList;
