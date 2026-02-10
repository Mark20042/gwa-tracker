import { useState, useContext } from "react";
import GradesContext from "../store/grade-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

const AddSubjectDialog = ({ yearId, semesterId }) => {
  const { addSubject } = useContext(GradesContext);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState({
    name: "",
    units: "",
    grade: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject.name && subject.units) {
      addSubject(yearId, semesterId, subject);
      setSubject({ name: "", units: "", grade: "" });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" title="Add Subject">
          <PlusCircle className="w-4 h-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Subject
            </Label>
            <Input
              id="name"
              value={subject.name}
              onChange={(e) => setSubject({ ...subject, name: e.target.value })}
              className="col-span-3"
              placeholder="e.g. Calculus 1"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="units" className="text-right">
              Units
            </Label>
            <Input
              id="units"
              type="number"
              step="0.5"
              value={subject.units}
              onChange={(e) =>
                setSubject({ ...subject, units: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g. 3.0"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grade" className="text-right">
              Grade
            </Label>
            <Input
              id="grade"
              type="number"
              step="0.01"
              value={subject.grade}
              onChange={(e) =>
                setSubject({ ...subject, grade: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g. 1.25 / 0 if no grade yet"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Subject</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
