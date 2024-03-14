import { GetTestById } from "@/action/test";
import TestComponent from "@/components/elements/test/test-complete";


export default async function Builder({params}:{params:{id:string}}) {
  const {id} = params;
  const test = await GetTestById({id});
  if (!test) {
    throw new Error("test not found");
  }
    return (
        <TestComponent test={test}/>
    );
  }
  
  