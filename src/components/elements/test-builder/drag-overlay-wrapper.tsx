'use client'
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core"
import { useState } from "react";
import { SidebarButtonElementDragOverlay } from "./sidebar-button-element";
import { ElementsType, TestElements } from "@/types/TestElements";
import useDesigner from "@/components/hooks/useDesigner";

export default function DragOverlayWrapper() {
    const {elements} = useDesigner()
    const [draggedItem,setDraggedItem] = useState<Active|null>(null)

    useDndMonitor({
        onDragStart: (event) => {
            setDraggedItem(event.active)
        },
        onDragCancel: () => {
            setDraggedItem(null)
        },
        onDragEnd: () => {
            setDraggedItem(null)
        }
    })
    
    if(!draggedItem) return null

    let node = <div>Элемент не обнаружен</div>
    const isSidebarButtonElement = draggedItem?.data?.current?.isDesignerButtonElement
    
    if(isSidebarButtonElement){
        const type = draggedItem?.data?.current?.type as ElementsType
        node = <SidebarButtonElementDragOverlay testElement={TestElements[type]}/>
    }

    const isDesignerElement = draggedItem?.data?.current?.isDesignerElement
    if(isDesignerElement) {
        const elementId = draggedItem?.data?.current?.elementId
        const element = elements.find((el) => el.id === elementId)
        if(!element) node = <div>Элемент не найден!</div>
        else {
            const DesignerElementComponent = TestElements[element.type].designerComponent;
            node = (
                <div className='flex bg-accent border rounded-md w-full py-2 px-4 opacity-80 pointer-events-none'>
                    <DesignerElementComponent elementInstance={element}/>
                </div>
            )
        }
    }
    return (
        <DragOverlay>{node}</DragOverlay>
    )
}