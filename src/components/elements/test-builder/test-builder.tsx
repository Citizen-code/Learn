'use client'

import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import Designer from "./designer";
import PreviewDialogButton from "./preview-dialog-button";
import PublishTestButton from "./publish-test-button";
import SaveTestButton from "./save-test-button";
import DragOverlayWrapper from "./drag-overlay-wrapper";
import { test, test_questions } from "@prisma/client";
import useDesigner from "@/components/hooks/useDesigner";
import { useEffect, useState } from "react";
import { TestElementInstance } from "@/types/TestElements";
import { ImSpinner2 } from "react-icons/im";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

export default function TestBuilder({ test }: { test: test & {test_questions:test_questions|null} }) {
  const { setElements, setSelectedElement } = useDesigner();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setElements(test.test_questions?.question as TestElementInstance[]);
    setSelectedElement(null);
    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [test, setElements, isReady, setSelectedElement]);
  
  
    const mouseSensor = useSensor(MouseSensor, {
      activationConstraint:{
        distance:10,
      }
    });

    const touchSensor = useSensor(TouchSensor, {
      activationConstraint:{
        delay:300,
        tolerance:5
      }
    });

    const sensors = useSensors(mouseSensor,touchSensor);

    if (!isReady) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <ImSpinner2 className="animate-spin h-12 w-12" />
        </div>
      );
    }

    if (test.is_public) {
      return (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="max-w-md">
              <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
                Тест опубликован
              </h1>
              <div className="flex justify-between">
                <Button variant={"link"} asChild>
                  <Link href={"/"} className="gap-2">
                    <BsArrowLeft />
                    На главный экран
                  </Link>
                </Button>
                <Button variant={"link"} asChild>
                  <Link href={`/tests/${test.id}`} className="gap-2">
                    Просмотреть тест
                    <BsArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    }

      return (
        <DndContext sensors={sensors}>
          <main className='flex flex-col w-full'>
            <div className='flex justify-between border-b-2 p-4 gap-3 items-center'>
              <h2 className='truncate font-medium'>
                <span className='text-muted-foreground mr-2'>Тестирование:</span>
                {test.name}
              </h2>
              <div className='flex items-center gap-2'>
                <PreviewDialogButton/>
                {!test.is_public && (
                  <>
                    <SaveTestButton id={test.id}/>
                    <PublishTestButton id={test.id}/>
                  </>
                )}
              </div>
            </div>
            <div className='flex w-full flex-grow items-center justify-center relative overflow-auto h-[200px] bg-accent  bg-[url(/builder-bg-light.svg)] dark:bg-[url(/builder-bg-dark.svg)]'>
              <Designer/>
            </div>
          </main>
          <DragOverlayWrapper/>
        </DndContext>
      );
    }
    