import { GetTestById } from "@/action/test";
import TestBuilder from "@/components/elements/test-builder/test-builder";

export default async function Builder({params}:{params:{id:string}}) {
  const {id} = params;
  const test = await GetTestById({id});
  if (!test) {
    throw new Error("test not found");
  }
    return (
      <TestBuilder test={test}/>
    );
  }
  