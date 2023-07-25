import { createContext, useState } from "react";



export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [counter, setcounter] = useState(0);
    const [transactionDate, settransactionDate] = useState({
        dateType: "Daily",
        startingDate: new Date(),
        endingDate: new Date()
    });
    return <UserContext.Provider value={{ counter, setcounter,transactionDate, settransactionDate }}>{children}</UserContext.Provider>
};