import { useCallback } from "react";
import GradesContext from "./grade-context";
import useLocalStorage from "../hooks/useLocalStorage";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const GradeProvider = ({ children }) => {
  const [data, setData] = useLocalStorage("gwa_data_v2", []);

  const addYear = (level) => {
    setData((prev) => [
      ...prev,
      {
        id: uuidv4(),
        level, // e.g., "1st Year", "2nd Year"
        semesters: [],
      },
    ]);
    toast.success(`${level} added!`);
  };

  const deleteYear = (yearId) => {
    setData((prev) => prev.filter((y) => y.id !== yearId));
    toast.info("Year level removed.");
  };

  const addSemester = (yearId, term) => {
    setData((prev) =>
      prev.map((year) => {
        if (year.id === yearId) {
          return {
            ...year,
            semesters: [
              ...year.semesters,
              {
                id: uuidv4(),
                term, // e.g., "1st Semester", "Summer"
                subjects: [],
              },
            ],
          };
        }
        return year;
      })
    );
    toast.success(`${term} added!`);
  };

  const deleteSemester = (yearId, semesterId) => {
    setData(prev => prev.map(year => {
      if (year.id === yearId) {
        return {
          ...year,
          semesters: year.semesters.filter(sem => sem.id !== semesterId)
        }
      }
      return year;
    }))
    toast.info("Semester removed.");
  };

  const addSubject = (yearId, semesterId, subject) => {
    const newSubject = { ...subject, id: uuidv4() };
    setData((prev) =>
      prev.map((year) => {
        if (year.id === yearId) {
          return {
            ...year,
            semesters: year.semesters.map((sem) => {
              if (sem.id === semesterId) {
                return {
                  ...sem,
                  subjects: [...sem.subjects, newSubject],
                };
              }
              return sem;
            }),
          };
        }
        return year;
      })
    );
    toast.success("Subject added!");
  };

  const removeSubject = (yearId, semesterId, subjectId) => {
    setData((prev) =>
      prev.map((year) => {
        if (year.id === yearId) {
          return {
            ...year,
            semesters: year.semesters.map((sem) => {
              if (sem.id === semesterId) {
                return {
                  ...sem,
                  subjects: sem.subjects.filter((s) => s.id !== subjectId),
                };
              }
              return sem;
            }),
          };
        }
        return year;
      })
    );
    toast.info("Subject removed.");
  };

  const updateSubject = (yearId, semesterId, subjectId, field, value) => {
    setData((prev) =>
      prev.map((year) => {
        if (year.id === yearId) {
          return {
            ...year,
            semesters: year.semesters.map((sem) => {
              if (sem.id === semesterId) {
                return {
                  ...sem,
                  subjects: sem.subjects.map(sub => {
                    if (sub.id === subjectId) {
                      return { ...sub, [field]: value }
                    }
                    return sub;
                  }),
                };
              }
              return sem;
            }),
          };
        }
        return year;
      })
    );
  }

  const clearAll = () => {
    if (confirm("Are you sure you want to delete all data?")) {
      setData([]);
      toast.success("All data cleared.");
    }
  }

  const calculateGWA = useCallback((subjects) => {
    if (!subjects || subjects.length === 0) return 0;

    // Filter subjects with valid numeric grades (exclude 0 as it represents "no grade")
    const validSubjects = subjects.filter((sub) => {
      const g = parseFloat(sub.grade);
      return !isNaN(g) && sub.grade !== "" && sub.grade !== null && g !== 0;
    });

    if (validSubjects.length === 0) return 0;

    const totalUnits = validSubjects.reduce(
      (acc, curr) => acc + parseFloat(curr.units || 0),
      0
    );
    const totalWeighted = validSubjects.reduce(
      (acc, curr) =>
        acc + parseFloat(curr.units || 0) * parseFloat(curr.grade),
      0
    );
    return totalUnits === 0 ? 0 : totalWeighted / totalUnits;
  }, []);

  const contextValue = {
    data,
    addYear,
    deleteYear,
    addSemester,
    deleteSemester,
    addSubject,
    removeSubject,
    updateSubject,
    calculateGWA,
    clearAll
  };

  return (
    <GradesContext.Provider value={contextValue}>
      {children}
    </GradesContext.Provider>
  );
};

export default GradeProvider;
