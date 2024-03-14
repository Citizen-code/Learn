import useDesigner from "@/components/hooks/useDesigner";
import TestDesignerSidebar from "./test-designer-sidebar";
import PropertiesTestSidebar from "./properties-test-sidebar";

export default function DesignerSidebar() {
    const { selectedElement } = useDesigner();

    return (
        <aside className='w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full'>
            {!selectedElement && <TestDesignerSidebar/>}
            {selectedElement && <PropertiesTestSidebar/>}
        </aside>
    );
  }
  