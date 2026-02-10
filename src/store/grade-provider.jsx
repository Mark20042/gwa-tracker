import { useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage"; // Ensure this path is correct
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import GradesContext from "./grade-context";

const GradesProvider = ({ children }) => {
  //  store the main data structure in local storage
  const [years, setYears] = useLocalStorage("gwa_data_v2", []);

  const addYear = (levelLabel) => {
    const newYear = {
      id: uuidv4(),
      level: levelLabel,
      semesters: [],
    };
    setYears((prev) => [...prev, newYear]);
    toast.success(`${levelLabel} added!`);
  };

  const deleteYear = (yearId) => {
    setYears((prev) => prev.filter((y) => y.id !== yearId));
    toast.info("Year level removed.");
  };

  const addSemester = (yearId, termLabel) => {
    const newSemester = {
      id: uuidv4(),
      term: termLabel,
      subjects: [],
    };

    setYears((prev) =>
      prev.map((year) => {
        if (year.id === yearId) {
          return { ...year, semesters: [...year.semesters, newSemester] };
        }
        return year;
      }),
    );
    toast.success(`${termLabel} added!`);
  };

  const deleteSemester = (yearId, semesterId) => {
    setYears((prev) =>
      prev.map((year) => {
        if (year.id === yearId) {
          return {
            ...year,
            semesters: year.semesters.filter((sem) => sem.id !== semesterId),
          };
        }
        return year;
      }),
    );
    toast.info("Semester removed.");
  };

  const addSubject = (yearId, semesterId, subject) => {
    const newSubject = {
      id: uuidv4(),
      name: subject.name || "New Subject",
      grade: parseFloat(subject.grade) || 0,
      units: parseFloat(subject.units) || 0,
    };

    setYears((prev) =>
      prev.map((year) => {
        if (year.id !== yearId) return year;

        return {
          ...year,
          semesters: year.semesters.map((sem) => {
            if (sem.id !== semesterId) return sem;

            return {
              ...sem,
              subjects: [...sem.subjects, newSubject],
            };
          }),
        };
      }),
    );
    toast.success("Subject added!");
  };

  const removeSubject = (yearId, semesterId, subjectId) => {
    setYears((prev) =>
      prev.map((year) => {
        if (year.id !== yearId) return year;
        return {
          ...year,
          semesters: year.semesters.map((sem) => {
            if (sem.id !== semesterId) return sem;
            return {
              ...sem,
              subjects: sem.subjects.filter((sub) => sub.id !== subjectId),
            };
          }),
        };
      }),
    );
    toast.info("Subject removed.");
  };

  const updateSubject = (yearId, semesterId, subjectId, field, value) => {
    setYears((prev) =>
      prev.map((year) => {
        if (year.id !== yearId) return year;
        return {
          ...year,
          semesters: year.semesters.map((sem) => {
            if (sem.id !== semesterId) return sem;
            return {
              ...sem,
              subjects: sem.subjects.map((sub) => {
                if (sub.id !== subjectId) return sub;

                let normalizedValue = value;
                if (field === "units" || field === "grade") {
                  const parsed = parseFloat(value);
                  normalizedValue = isNaN(parsed) ? 0 : parsed;
                }

                return { ...sub, [field]: normalizedValue };
              }),
            };
          }),
        };
      }),
    );
  };

  const clearAll = () => {
    if (
      confirm(
        "Are you sure you want to delete all data? This cannot be undone.",
      )
    ) {
      setYears([]);
      toast.success("All data cleared.");
    }
  };

  //  CALCULATION LOGIC (basic averages)

  //    Per-subject GWA: average of all subjects in a semester.
  //    GWA = (Σ grade_i) / (number of graded subjects),
  //    skipping subjects with 0/NaN grade (treated as "not yet graded").
  const calculateGWA = useCallback((subjects) => {
    if (!subjects || subjects.length === 0) return 0;

    let total = 0;
    let count = 0;

    subjects.forEach((sub) => {
      const grade = parseFloat(sub.grade);
      // Treat 0 or NaN as "not yet graded"
      if (!isNaN(grade) && grade !== 0) {
        total += grade;
        count += 1;
      }
    });

    if (count === 0) return 0;

    return total / count;
  }, []);

  //    Per-year GWA: average of semester GWAs for this year.
  //    We skip years with no semesters.
  const getYearGWA = useCallback(
    (yearId) => {
      const year = years.find((y) => y.id === yearId);
      if (!year || !year.semesters || year.semesters.length === 0) return 0;

      const semGwas = year.semesters
        .map((sem) => {
          const raw = calculateGWA(sem.subjects);
          if (raw <= 0 || Number.isNaN(raw)) return 0;

          const truncated = Math.trunc(raw * 100) / 100;
          return truncated;
        })
        .filter((g) => g > 0);

      if (semGwas.length === 0) return 0;

      const total = semGwas.reduce((sum, g) => sum + g, 0);
      return total / semGwas.length;
    },
    [years, calculateGWA],
  );

  //     Overall GWA: average of year GWAs.
  //     We skip years with no semesters.
  const getOverallGWA = useCallback(() => {
    if (!years || years.length === 0) return 0;

    const yearGwas = years
      .map((y) => {
        if (!y.semesters || y.semesters.length === 0) return 0;
        const rawYear = getYearGWA(y.id);
        if (rawYear <= 0 || Number.isNaN(rawYear)) return 0;

        const truncated = Math.trunc(rawYear * 1000) / 1000;
        return truncated;
      })
      .filter((g) => g > 0);

    if (yearGwas.length === 0) return 0;

    const totalYears = yearGwas.reduce((sum, g) => sum + g, 0);
    return totalYears / yearGwas.length;
  }, [years, getYearGWA]);

  const contextValue = {
    years,
    addYear,
    deleteYear,
    addSemester,
    deleteSemester,
    addSubject,
    removeSubject,
    updateSubject,
    clearAll,
    calculateGWA,
    getYearGWA,
    getOverallGWA,
  };

  return (
    <GradesContext.Provider value={contextValue}>
      {children}
    </GradesContext.Provider>
  );
};

export default GradesProvider;
