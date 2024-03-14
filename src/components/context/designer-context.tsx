'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react"
import { TestElementInstance } from "@/types/TestElements"

type DesignerContextType = {
    elements: TestElementInstance[],
    setElements:Dispatch<SetStateAction<TestElementInstance[]>>,
    addElement: (index: number, element: TestElementInstance) => void,
    removeElement: (id: string) => void,

    selectedElement:TestElementInstance | null,
    setSelectedElement:Dispatch<SetStateAction<TestElementInstance|null>>,

    updateElement: (id:string, element:TestElementInstance) => void
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export default function DesignerContextProvider({children}:{children:ReactNode}) {
  const [elements, setElements] = useState<TestElementInstance[]>([])
  const [selectedElement,setSelectedElement] = useState<TestElementInstance|null>(null)

  const addElement = (index: number, element: TestElementInstance) => {
    setElements((prev) => {
        const newElement = [...prev];
        newElement.splice(index, 0, element)
        return newElement
    })
  }

  const removeElement = (id: string) => {
    setElements((prev) =>
        prev.filter((element) => element.id !== id)
    )
  }

  const updateElement = (id: string, element: TestElementInstance) => {
    setElements((prev) => {
        const newElement = [...prev];
        const index = newElement.findIndex((el) => el.id === id)
        newElement[index] = element
        return newElement
    })
  }

  return (<DesignerContext.Provider value={{elements, setElements, addElement, removeElement, selectedElement, setSelectedElement, updateElement}}>
    {children}
  </DesignerContext.Provider>)
}