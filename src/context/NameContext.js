import React, { createContext, useState } from "react";

export const NameContext = React.createContext()

export const NameProvider = ({children}) => {
    
    const [name, setName] = useState()

    return (
        <NameContext.Provider value={{name, setName}}>
            {children}
        </NameContext.Provider>
    )
}