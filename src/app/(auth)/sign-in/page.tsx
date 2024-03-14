import Authorization from "@/components/elements/authorization";

export default function Page(){
  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
        <Authorization/>
      </div>
    </div>
            
  )
}