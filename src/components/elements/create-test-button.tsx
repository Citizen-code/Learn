"use client";

import { ImSpinner2 } from "react-icons/im";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {BsFileEarmarkPlus} from 'react-icons/bs'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { z } from "zod";
import { CreateTest } from "@/action/test";
import useAuth from "../hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { level } from "@prisma/client";

const testSchema = z.object({
  name: z.string().min(4),
  description: z.string().optional(),
  level_id: z.number(),
  author_id:z.string().default(''),
});

export type testSchemaType = z.infer<typeof testSchema>;

export default function CreateTestButton({levels}:{levels:level[]|undefined}) {
    const {userData} = useAuth();
    const router = useRouter();
    const form = useForm<testSchemaType>({
      resolver: zodResolver(testSchema),
    });
  
    async function onSubmit(values: testSchemaType) {
      try {
        values.author_id = userData!.id;
        const testId = (await CreateTest({values})).id
        toast({
          title: "Успешно",
          description: "Тест создан успешно",
        });
        router.push(`/builder/${testId}`);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Что-то пошло не так, пожалуйста попробуйте позже",
          variant: "destructive",
        });
      }
    }
  

    return (
    <Dialog>
      <DialogTrigger asChild>
        <Button id="new-test-create"
          variant={"outline"}
          className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4">
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Создайте новый тест</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создание теста</DialogTitle>
          <DialogDescription>Создайте новый тест для заполнения его вопросами.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Наименование</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='level_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Уровень теста</FormLabel>
                  <FormControl>
                    <Select defaultValue={`field.value`} onValueChange={(e) => form.setValue('level_id', parseInt(e))}>
                      <SelectTrigger>
                        <SelectValue placeholder='Выберите уровень...'/>
                      </SelectTrigger>
                      <SelectContent>
                      {levels?.map(i => (
                        <SelectItem value={`${i.id}`}>{i.name}</SelectItem>
                      ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
            {!form.formState.isSubmitting && <span>Сохранить</span>}
            {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    );
  }
  