import { createContext } from "react";

const GradesContext = createContext({
    data: [], 
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
