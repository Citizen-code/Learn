import { SingleSelection } from "@/components/elements/test-builder/fields/single-selection"
import { Dispatch, SetStateAction } from "react"

export type ElementsType = "singleSelection" //| "multipleSelection"

export type TestElement = {
    type: ElementsType,

    construct: (id: string) => TestElementInstance

    designerButtonElement: {
        icon: React.ElementType,
        label: string
    }

    designerComponent: React.FC<{
        elementInstance:TestElementInstance
    }>,
    testComponent: React.FC<{
        elementInstance:TestElementInstance,
        selectedAnswers:string[]|undefined,
        isResult:boolean|undefined
        setSelectedAnswers:Dispatch<SetStateAction<string[]>>|undefined
    }>,
    propertiesComponent: React.FC<{
        elementInstance:TestElementInstance
    }>,
}

export type TestElementInstance = {
    id: string,
    type: ElementsType,
    extraAttributes: Record<string, any>;
}

type TestElementsType = {
    [key in ElementsType]: TestElement
}

export const TestElements: TestElementsType = {
    singleSelection: SingleSelection
}