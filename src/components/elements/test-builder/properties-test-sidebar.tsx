import useDesigner from "@/components/hooks/useDesigner";
import { Button } from "@/components/ui/button";
import { TestElements } from "@/types/TestElements";
import {AiOutlineClose} from 'react-icons/ai'

export default function PropertiesTestSidebar() {
    const { selectedElement, setSelectedElement } = useDesigner();
    if(!selectedElement) return null 

    const PropertiesElement = TestElements[selectedElement.type].propertiesComponent

    return (
        <div className='flex flex-col p-2'>
            <div className="flex justify-between items-center">
                <p className="test-sm text-foreground/70">Свойства вопроса</p>
                <Button size={'icon'} variant={'ghost'} onClick={() => setSelectedElement(null)}>
                    <AiOutlineClose />
                </Button>
            </div>
            <PropertiesElement elementInstance={selectedElement}/>
        </div>
    );
  }
  