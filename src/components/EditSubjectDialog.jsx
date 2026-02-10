import { useState, useContext, useEffect } from "react";
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
import { Pencil } from "lucide-react";

const EditSubjectDialog = ({ yearId, semesterId, subject }) => {
  const { updateSubject } = useContext(GradesContext);
  const [open, setOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    units: "",
    grade: "",
  });

  useEffect(() => {
    if (subject) {
      setEditForm({
        name: subject.name || subject.code || "",
        units: subject.units || "",
        grade: subject.grade || "",
      });
    }
  }, [subject, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editForm.name && editForm.units) {
      if (editForm.name !== (subject.name || subject.code)) {
        updateSubject(yearId, semesterId, subject.id, "name", editForm.name);
      }
      if (editForm.units !== subject.units) {
        updateSubject(yearId, semesterId, subject.id, "units", editForm.units);
      }
      if (editForm.grade !== subject.grade) {
        updateSubject(yearId, semesterId, subject.id, "grade", editForm.grade);
      }

      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-primary"
          title="Edit Subject"
        >
          <Pencil className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Subject
            </Label>
            <Input
              id="edit-name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g. Calculus 1"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-units" className="text-right">
              Units
            </Label>
            <Input
              id="edit-units"
              type="number"
              step="0.5"
              value={editForm.units}
              onChange={(e) =>
                setEditForm({ ...editForm, units: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g. 3.0"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-grade" className="text-right">
              Grade
            </Label>
            <Input
              id="edit-grade"
              type="number"
              step="0.01"
              value={editForm.grade}
              onChange={(e) =>
                setEditForm({ ...editForm, grade: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g. 1.25"
              required={false}
            />
            <p className="text-[10px] text-muted-foreground col-start-2 col-span-3 -mt-2">
              Leave empty or input 0 if not yet graded.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubjectDialog;
