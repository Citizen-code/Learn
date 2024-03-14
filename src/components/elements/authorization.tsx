'use client'
import { AuthEmployee } from "@/action/test";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { ImSpinner2 } from "react-icons/im";
import { SetAuth } from "@/action/auth";

const authSchema = z.object({
  login: z.string().min(5).max(50),
  password: z.string().min(5).max(50),
});

export type authSchemaType = z.infer<typeof authSchema>;

export default function Authorization() {
    const router = useRouter();
    const form = useForm<authSchemaType>({
      resolver: zodResolver(authSchema),
    });
    async function onSubmit(values: authSchemaType) {
      try {
        const employee = (await AuthEmployee({...values}))
        if(!employee) {
          toast({
            title: "Ошибка",
            description: "Недействительные данные авторизации, проверьте правильность введенных данных",
            variant: "destructive",
          });
          return;
        }
        await SetAuth({employee:employee.employee_credentials!})
        toast({
          title: "Успешно",
          description: "Успешная авторизация",
        });
        router.push(`/`);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Что-то пошло не так, пожалуйста попробуйте позже",
          variant: "destructive",
        });
      }
    }
    return (
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name='login'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input id='login' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input id='password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <Button id='auth' onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
            {!form.formState.isSubmitting && <span>Войти</span>}
            {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
          </Button>
        </Form>
    );
  }
  