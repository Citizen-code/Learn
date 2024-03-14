'use client'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { MdPreview } from 'react-icons/md'
import useDesigner from "@/components/hooks/useDesigner";
import { TestElements } from "@/types/TestElements";
import { useState } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function PreviewDialogButton() {
  const {elements} = useDesigner()
  const [api, setApi] = useState<CarouselApi>()

    return (
      <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="gap-2">
          <MdPreview className="h-6 w-6" />
          Просмотр
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">Предпросмотр теста</p>
          <p className="text-sm text-muted-foreground">Это то как будет выглядеть тест.</p>
        </div>
        <Carousel opts={{watchDrag:undefined}} setApi={setApi} className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/builder-bg-light.svg)] dark:bg-[url(/builder-bg-dark.svg)] ">
          <div className="flex flex-col bg-background rounded-2xl p-8">
              <CarouselContent>
                {elements.map((element) => {
                  const FormComponent = TestElements[element.type].testComponent;
                  return <CarouselItem key={element.id}>
                    <FormComponent key={element.id} elementInstance={element} selectedAnswers={undefined} setSelectedAnswers={undefined} isResult={false} />
                  </CarouselItem>;
                })}
              </CarouselContent>
              <div className='flex justify-between p-4 items-center'>
                <Button onClick={() => {
                  api?.scrollNext();
                }}>Пропустить</Button>
                <Button onClick={() => {
                  api?.scrollNext();
                }}>Проверить</Button>
              </div>
          </div>
        </Carousel>
      </DialogContent>
    </Dialog>
    );
  }
  