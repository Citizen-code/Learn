'use client'
import { v4 } from "uuid";
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { ElementsType, TestElement, TestElementInstance } from '@/types/TestElements'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { FaRegCircleDot } from 'react-icons/fa6'
import { PiSealCheckDuotone } from 'react-icons/pi'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import useDesigner from '@/components/hooks/useDesigner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import { UUID } from "crypto";
import { cn } from "@/lib/utils";

type SingleSelectionInstance = TestElementInstance & {
  extraAttributes: {
    task: string,
    image: string,
    answers: {
      id: UUID
      text: string,
      is_true: boolean
    }[]
  }
}

const type: ElementsType = "singleSelection";
const extraAttributes = {
  task: '',
  answers: [{ id: v4(), text: '', is_true: false }, { id: v4(), text: '', is_true: true }]
}

const propertiesSchema = z.object({
  task: z.string().max(200),
  image: z.string().url().optional(),
  answers: z.array(z.object({
    id: z.string().uuid(),
    text: z.string(),
    is_true: z.boolean().default(false),
  })).default([])
})

export const SingleSelection: TestElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerButtonElement: {
    icon: FaRegCircleDot,
    label: "Одиночный выбор"
  },
  designerComponent: DesignerComponent,
  testComponent: TestComponent,
  propertiesComponent: PropertiesComponent,
}

function TestComponent({ elementInstance,isResult, selectedAnswers, setSelectedAnswers }: { elementInstance: TestElementInstance,isResult:boolean|undefined, selectedAnswers:string[]|undefined, setSelectedAnswers:Dispatch<SetStateAction<string[]>>|undefined }) {
  const element = elementInstance as SingleSelectionInstance;
  return <div className='p-2 pb-4'>
    <div className='text-2xl italic'>Выберите верный вариант</div>
    <div className='flex items-center p-1'>
      {element.extraAttributes.image && (
        <Image src={element.extraAttributes.image} alt='Изображение' width={100} height={100} />
      )}
      <div className='ms-2'>{element.extraAttributes.task}</div>
    </div>
    <Separator className='mt-2 mb-2' />
    <RadioGroup className={cn('ps-4 pt-2', element.extraAttributes.answers.length > 4 && 'grid grid-cols-2')}>
      {element.extraAttributes.answers.map(answer =>
        <div key={`${element.id}-${answer.id}`} className='flex items-center space-x-2'>
          <RadioGroupItem disabled={isResult ?? false} onClick={() => {
            if(setSelectedAnswers && selectedAnswers) {
              setSelectedAnswers([answer.id])
            }
          }} value={`${answer.id}`} id={`${element.id}-${answer.id}`} />
          <Label htmlFor={`${element.id}-${answer.id}`}>{answer.text}</Label>
        </div>
      )}
    </RadioGroup>
  </div>
}

function DesignerComponent({ elementInstance }: { elementInstance: TestElementInstance }) {
  const element = elementInstance as SingleSelectionInstance;
  return <div className='p-2 pb-4'>
    <div className='text-2xl italic'>Выберите верный вариант</div>
    <div className='flex items-center p-1'>
      <Image className='cursor-not-allowed block dark:hidden' src={!element.extraAttributes.image ? '/im-missing-light.svg' : element.extraAttributes.image} alt='Отсутствует изображение' width={50} height={50} />
      <Image className='cursor-not-allowed hidden dark:block' src={!element.extraAttributes.image ? '/im-missing-dark.svg' : element.extraAttributes.image} alt='Отсутствует изображение' width={50} height={50} />
      <div className='ms-2'>{!element.extraAttributes.task ? '[Введите значение...]' : element.extraAttributes.task}</div>
    </div>
    <Separator className='mt-2 mb-2' />
    <RadioGroup disabled className={cn('ps-4 pt-2', element.extraAttributes.answers.length > 4 && 'grid grid-cols-2')}>
      {element.extraAttributes.answers.map(answer =>
        <div key={`${element.id}-${answer.id}`} className='flex items-center space-x-2'>
          <RadioGroupItem value={`${answer.id}`} id={`${answer.id}`} />
          <Label className='cursor-not-allowed' htmlFor={`${answer.id}`}>{!answer.text ? '[Введите значение...]' : answer.text}</Label>
        </div>
      )}
    </RadioGroup>
  </div>
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({ elementInstance }: { elementInstance: TestElementInstance }) {
  const element = elementInstance as SingleSelectionInstance;
  const { updateElement } = useDesigner();
  console.log(propertiesSchema.parse(element.extraAttributes))
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      task: element.extraAttributes.task,
      answers: element.extraAttributes.answers,
      image: element.extraAttributes.image
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { task, answers, image } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        task,
        answers,
        image,
      }
    })
  }
  return <Form {...form}>
    <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => {
      e.preventDefault();
    }} className='space-y-3'>
      <FormField control={form.control} name='task' render={({ field }) => (
        <FormItem>
          <FormLabel>Текст вопроса</FormLabel>
          <FormControl>
            <Input {...field} onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }} />
          </FormControl>
          <FormDescription>
            Введите текст вопроса.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name='image' render={({ field }) => (
        <FormItem>
          <FormLabel>Изображение</FormLabel>
          <FormControl>
            <div className='flex justify-between items-center'>
            <Input {...field} onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }} />
            <Button variant={"ghost"} size={"icon"}
                  onClick={(e) => {
                    field.onChange(undefined);
                    e.preventDefault();
                  }}>
                  <AiOutlineClose />
                </Button>
            </div>
          </FormControl>
          <FormDescription>
            Введите url изображения.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name='answers' render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>Ответы</FormLabel>
            <Button hidden={element.extraAttributes.answers.length >= 8}
              variant={"outline"}
              className="gap-2"
              onClick={(e) => {
                e.preventDefault();
                form.setValue('answers', [...field.value, { id: v4(), text: '', is_true: false }]);
              }}
            >
              <AiOutlinePlus />
              Добавить
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {form.watch('answers').map((option, index) => (
              <div key={index} className="flex items-center justify-between gap-1">
                <Input
                  placeholder=""
                  value={option.text}
                  onChange={(e) => {
                    field.value[index].text = e.target.value;
                    field.onChange(field.value);
                  }}
                />
                <PiSealCheckDuotone className='h-8 w-8'
                  onClick={() => {
                    field.value[index].is_true = !field.value[index].is_true;
                    field.onChange(field.value);
                  }}
                  fill-rule="nonzero"
                  fill={option.is_true ? "green" : "red"}
                />
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={(e) => {
                    e.preventDefault();
                    const newOptions = [...field.value];
                    newOptions.splice(index, 1);
                    field.onChange(newOptions);
                  }}
                >
                  <AiOutlineClose />
                </Button>
              </div>
            ))}
          </div>
        </FormItem>
      )} />
    </form>
  </Form>
}
