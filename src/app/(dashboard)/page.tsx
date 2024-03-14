import CreateTestButton from "@/components/elements/create-test-button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { CheckAuth } from "@/action/auth";
import { GetEmployeeTests, GetTests } from "@/action/test";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { employee, level, result, test } from "@prisma/client";
import prisma from '@/core/db'
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit, FaWpforms } from "react-icons/fa";

export default async function Home() {
  const user = await CheckAuth()
  const is_teacher = user?.employee_position.findIndex((i) => i.position_id === 1) !== -1
    return (
          <div className="container pt-4">
            <h2 className="text-4xl font-bold col-span-2">Ваши тесты</h2>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {is_teacher && <CreateTestButton levels={await prisma?.level.findMany()}/>}
              <Suspense
                fallback={[1, 2, 3, 4].map((el) => (
                  <TestCardSkeleton key={el} />
                ))}
              >
                <TestCards employee={user as employee} is_teacher={is_teacher}/>
              </Suspense>
            </div>
          </div>
    );
  }

  function TestCardSkeleton() {
    return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
  }
  
  async function TestCards({employee, is_teacher}:{employee:employee,is_teacher:boolean}) {
    const tests = is_teacher ? await GetEmployeeTests({id:employee?.id}) : await GetTests();
    return (
      <>
        {tests.map((test) => (
          <TestCard key={test.id} test={test} is_teacher={is_teacher}/>
        ))}
      </>
    );
  }
  
  function TestCard({ test, is_teacher }: { test: test & {level:level|undefined,result:result[]|undefined},is_teacher:boolean }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <span className="truncate font-bold">{test.name}</span>
            {is_teacher && (
              <>
              {test.is_public && <Badge>Опубликован</Badge>}
              {!test.is_public && <Badge variant={"destructive"}>Черновик</Badge>}
              </>
            )}
            {!is_teacher && (
              <>
              {test.level && <Badge variant={"destructive"}>{test.level.name}</Badge>}
              </>
            )}
          </CardTitle>
          <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {is_teacher && (
            <>
            {(test.is_public) && (
            <span className="flex items-center gap-2">
              <FaWpforms className="text-muted-foreground" />
              <span>{test.result?.length}</span>
            </span>
            )}
            </>
          )}
          
        </CardDescription>
        </CardHeader>
        {is_teacher && (<CardContent className="truncate text-sm text-muted-foreground">
          {test.description || "Нет описания"}
        </CardContent>)}
        <CardFooter>
          {(test.is_public && is_teacher) && (
            <Button asChild className="w-full mt-2 text-md gap-4">
              <Link href={`/tests/${test.id}`}>
                Просмотреть тест<BiRightArrowAlt />
              </Link>
            </Button>
          )}
          {(!test.is_public && is_teacher) && (
            <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
              <Link href={`/builder/${test.id}`}>
                Изменить тест <FaEdit />
              </Link>
            </Button>
          )}
          {!is_teacher && (
            <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
            <Link href={`/tests/${test.id}`}>
              Пройти тест <BiRightArrowAlt />
            </Link>
          </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  