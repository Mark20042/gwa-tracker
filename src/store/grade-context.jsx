import { createContext } from "react";

const GradesContext = createContext({
    data: [], // Array of Years
    addYear: () => { },
    deleteYear: () => { },
    addSemester: () => { },
    deleteSemester: () => { },
    addSubject: () => { },
    removeSubject: () => { },
    updateSubject: () => { },
    calculateGWA: () => { },
    clearAll: () => { },
});

export default GradesContext;
