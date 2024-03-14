import { TestElement } from "@/types/TestElements";
import { Button } from "../../ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export default function SidebarButtonElement({testElement}:{testElement:TestElement}) {
  const {label,icon:Icon} = testElement.designerButtonElement
    const draggable = useDraggable({
      id:`designer-button-${testElement.type}`,
      data:{
        type: testElement.type,
        isDesignerButtonElement:true
    }
  })
  return (
    <Button ref={draggable.setNodeRef} variant={'outline'} className={cn("flex flex-col gap-2 h-[120px] w-[120px] cursor-grab", draggable.isDragging && "ring-2 ring-primary")} {...draggable.listeners} {...draggable.attributes}>
      <Icon className='h-8 w-8 text-primary cursor-grab'/>
      <p className='text-xs'>{label}</p>
    </Button>
  );
}

export function SidebarButtonElementDragOverlay({testElement}:{testElement:TestElement}) {
    const {label,icon:Icon} = testElement.designerButtonElement
    return (
      <Button variant={'outline'} className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab">
        <Icon className='h-8 w-8 text-primary cursor-grab'/>
        <p className='text-xs'>{label}</p>
      </Button>
    );
}
