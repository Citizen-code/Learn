'use client'

import { CheckAuth } from "@/action/auth"
import type { employee, employee_credentials, employee_position, position } from "@prisma/client"
import { ReactNode, createContext, useEffect, useState } from "react"

export const AuthContext = createContext<DesignerContextType | null>(null)

type DesignerContextType = {
    userData: employee & {employee_credentials:employee_credentials | null, employee_position:(employee_position & {position:position})[]} | null,
}

export default function AuthContextProvider({children}:{children:ReactNode}) {
    const [userData, setUserData] = useState<employee & {employee_credentials:employee_credentials | null, employee_position:(employee_position & {position:position})[]} | null>(null)

    useEffect(() => {
        const run = async () => setUserData(await CheckAuth());
        run();
    },[])
  
    return (<AuthContext.Provider value={{userData}}>
      {children}
    </AuthContext.Provider>)
  }