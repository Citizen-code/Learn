import useDesigner from "@/components/hooks/useDesigner";
import { Button } from "../../ui/button";
import { HiSaveAs } from 'react-icons/hi'
import { UpdateTestById } from "@/action/test";
import { FaSpinner } from "react-icons/fa";
import { useTransition } from "react";
import { toast } from "@/components/ui/use-toast";

export default function SaveTestButton({ id }: { id: string }) {
  const { elements } = useDesigner()
  const [loading, startTransition] = useTransition();

  const updateTestContext = async () => {
    try {
      await UpdateTestById({ id, elements })
      toast({
        title: "Успешно",
        description: "Ваш тест был сохранен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Что то пошло не так",
        variant: "destructive",
      });
    }
  }

  return (
    <Button id="save-bnt"
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateTestContext);
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      Сохранение
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}
