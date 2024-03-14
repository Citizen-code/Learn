'use client'
import { SaveResult } from "@/action/test";
import useAuth from "@/components/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { TestElementInstance, TestElements } from "@/types/TestElements";
import { test, test_questions } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import Confetti from "react-confetti";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function TestComponent({ test }: { test: test & { test_questions: test_questions | null } }) {
    const router = useRouter(); 
    const {userData} = useAuth();
    if(!userData){
        router.push('/sign-in')
        return
    }
    const elements = test.test_questions?.question as TestElementInstance[]
    const [isResult, setIsResult] = useState<boolean>(false)
    const [isCorrect, setIsCorrect] = useState<boolean>(false)
    const [isFinally, setIsFinally] = useState<boolean>(elements.length == 0 ? true : false)

    const [correctAnswer, setCorrectAnswer] = useState<number>(0)
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])

    const [selectedElement, setSelectedElement] = useState<number>(0)

    return (
        <div className="flex justify-center w-full h-full items-center p-8">
            <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
                {!isFinally ? ( <>
                <div>{TestElements[elements[selectedElement].type].testComponent({elementInstance:elements[selectedElement], isResult, selectedAnswers, setSelectedAnswers})}</div>
                {!isResult && (
                  <div className='flex justify-between p-4 items-center'>
                    <Button onClick={() => {
                        setIsCorrect(false);
                        setIsResult(true);
                    }}>Пропустить</Button>
                    <Button onClick={() => {
                        const array = elements[selectedElement].extraAttributes.answers.filter((i:any) => i.is_true)
                        const result = selectedAnswers.filter((el:any) => array.findIndex((i:any) => i.id == el) !== -1)
                        if(array.length === result.length){
                            setCorrectAnswer(correctAnswer + 1);
                            setIsCorrect(true);
                        }
                        setIsResult(true);
                    }}>Проверить</Button>
                  </div>
                )}
                {isResult && (
                  <div className='flex justify-between p-4 items-center'>
                    {isCorrect ? <>
                        <h2 className='font-bold text-2xl text-green-500'>Отлично</h2>
                    </>: <>
                        {elements[selectedElement].type=='singleSelection' && (
                            <div>
                                <h2 className='font-bold text-1xl text-red-500'>Правильный ответ:</h2>
                                <div>{elements[selectedElement].extraAttributes.answers[elements[selectedElement].extraAttributes.answers.findIndex((i:any)=> i.is_true)]?.text}</div>
                            </div>
                        )}
                    </>}
                    {elements.length - 1 > selectedElement ? (
                        <Button onClick={() => {
                            setIsCorrect(false);
                            setSelectedAnswers([])
                            setIsResult(false);
                            setSelectedElement(selectedElement + 1)
                        }}>Далее</Button>
                    ): (
                        <Button onClick={() => {
                            if(userData.id !== test.author_id) {
                                SaveResult({info:{test_id:test.id,employee_id:userData.id, correct:correctAnswer, count:elements.length}})
                            }
                            setIsFinally(true)
                        }}>Завершить</Button>
                    )}
                    </div>
                    )}
                    </>
                ): 
                <div>
                    <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <div className="max-w-md">
                            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-5">
                                Тест успешно пройден
                            </h1>
                            <div>{`Вы успешно ответили на ${correctAnswer} из ${elements.length} вопросов.`}</div>

                            <div className="flex justify-between mt-3">
                                <Button variant={"link"} asChild>
                                <Link href={"/"} className="gap-2">
                                    <BsArrowLeft />
                                    На главный экран
                                </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}
