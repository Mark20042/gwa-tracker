import { useState, useContext } from "react";
import GradesContext from "../store/grade-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const AddSemesterDialog = ({ yearId }) => {
  const { addSemester } = useContext(GradesContext);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      addSemester(yearId, term.trim());
      setTerm("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Semester
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add Semester/Term</DialogTitle>
          <DialogDescription>
            Enter the name of the term (e.g., "1st Sem", "Summer").
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term" className="text-right">
                Term
              </Label>
              <Input
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="col-span-3"
                placeholder="1st Semester"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Term</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSemesterDialog;
