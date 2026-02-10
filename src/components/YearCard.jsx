import { useContext, useMemo } from "react";
import GradesContext from "../store/grade-context";
import SemesterCard from "./SemesterCard";
import AddSemesterDialog from "./AddSemesterDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const YearCard = ({ year }) => {
    const { deleteYear, calculateGWA } = useContext(GradesContext);

    const yearGwa = useMemo(() => {
        // Collect all subjects from all semesters in this year
        const allSubjects = year.semesters.flatMap((sem) => sem.subjects);
        return calculateGWA(allSubjects);
    }, [year.semesters, calculateGWA]);

    return (
        <Card className="w-full bg-slate-50 dark:bg-slate-900 border-2">
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-2 bg-primary rounded-full" />
                        <CardTitle className="text-2xl font-bold text-primary tracking-tight">
                            {year.level}
                        </CardTitle>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                        {yearGwa > 0 && (
                            <div className="flex items-center justify-between w-full md:w-auto bg-card px-4 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.03)] border animate-in fade-in zoom-in duration-300">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-2">
                                    {year.level} Average:
                                </span>
                                <span className="text-lg font-black text-primary">
                                    {yearGwa.toFixed(2)}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1 self-end md:self-auto">
                            <AddSemesterDialog yearId={year.id} />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-8 w-8"
                                onClick={() => deleteYear(year.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {year.semesters.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                        No semesters added yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {year.semesters.map((sem) => (
                            <SemesterCard key={sem.id} yearId={year.id} semester={sem} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default YearCard;
