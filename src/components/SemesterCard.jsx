import { useContext, useMemo } from "react";
import GradesContext from "../store/grade-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash2, Plus, Pencil, Check, X, PlusCircle } from "lucide-react";
import AddSubjectDialog from "./AddSubjectDialog";
import EditSubjectDialog from "./EditSubjectDialog";

const formatGwaNoRound = (value) => {
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num) || num <= 0) return "N/A";

  const truncated = Math.trunc(num * 100) / 100;
  const str = truncated.toString();

  if (!str.includes(".")) return `${str}.00`;

  const [intPart, decPart] = str.split(".");
  if (decPart.length === 1) return `${intPart}.${decPart}0`;
  if (decPart.length >= 2) return `${intPart}.${decPart.slice(0, 2)}`;

  return `${intPart}.${decPart}`;
};

const SemesterCard = ({ yearId, semester }) => {
  const { removeSubject, deleteSemester, calculateGWA } =
    useContext(GradesContext);

  const gwa = useMemo(
    () => calculateGWA(semester.subjects),
    [semester.subjects, calculateGWA],
  );

  const getGradeStatus = (grade) => {
    const numGrade = parseFloat(grade);
    if (isNaN(numGrade) || numGrade === 0) return null;
    if (numGrade >= 1.0 && numGrade <= 1.5) {
      return { label: "Excellent", color: "text-green-600  " };
    } else if (numGrade > 1.5 && numGrade <= 3.0) {
      return { label: "Passed", color: "text-blue-600 " };
    } else if (numGrade > 3.0 || numGrade === 5.0) {
      return { label: "Failed", color: "text-red-600 " };
    }
    return null;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm md:text-lg font-bold text-foreground flex items-center gap-2">
            <span className="text-primary px-3 py-1 truncate max-w-[150px] md:max-w-none">
              {semester.term}
            </span>
          </CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <AddSubjectDialog yearId={yearId} semesterId={semester.id} />
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => deleteSemester(yearId, semester.id)}
            title="Delete Semester"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Subject List */}
        <div className="mb-4 overflow-x-auto -mx-4 md:mx-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] pl-4 md:pl-2">
                  Subject Name
                </TableHead>
                <TableHead className="w-[15%] text-center px-1">
                  Units
                </TableHead>
                <TableHead className="w-[15%] text-center px-1">
                  Grade
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[15%] text-center">
                  Status
                </TableHead>
                <TableHead className="w-[15%] text-right pr-4 md:pr-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semester.subjects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground text-xs py-8"
                  >
                    No subjects added.
                  </TableCell>
                </TableRow>
              ) : (
                semester.subjects.map((sub) => {
                  const status = getGradeStatus(sub.grade);
                  return (
                    <TableRow key={sub.id} className="group">
                      <TableCell className="font-medium text-xs py-2 pl-4 md:pl-2">
                        <div
                          className="truncate max-w-[120px] sm:max-w-none"
                          title={sub.name || sub.code}
                        >
                          {sub.name || sub.code}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-center px-1 py-2">
                        {sub.units}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-center px-1 py-2">
                        {parseFloat(sub.grade) === 0 || !sub.grade ? (
                          <span className="text-muted-foreground font-normal italic">
                            N/A
                          </span>
                        ) : (
                          sub.grade
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-center py-2">
                        {status && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold  ${status.color}`}
                          >
                            {status.label}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-2 pr-4 md:pr-2">
                        <div className="flex justify-end gap-1">
                          <EditSubjectDialog
                            yearId={yearId}
                            semesterId={semester.id}
                            subject={sub}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() =>
                              removeSubject(yearId, semester.id, sub.id)
                            }
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 py-3 flex justify-end border-t">
        <p className="text-[10px] sm:text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          {semester.term} General Weighted Average :
          <span className="font-black text-base sm:text-xl text-primary">
            {formatGwaNoRound(gwa)}
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SemesterCard;
