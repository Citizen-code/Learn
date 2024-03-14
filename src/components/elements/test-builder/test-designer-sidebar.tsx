import SidebarButtonElement from "./sidebar-button-element";
import { TestElements } from "@/types/TestElements";

export default function TestDesignerSidebar() {
    return (
        <div>
            Вопросы
            <SidebarButtonElement testElement={TestElements.singleSelection}/>
        </div>
    );
  }
  