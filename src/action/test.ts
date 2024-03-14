"use server";

import { testSchemaType } from "@/components/elements/create-test-button";
import prisma from "@/core/db";
import { TestElementInstance } from "@/types/TestElements";

export async function CreateTest({values}:{values:testSchemaType}) {
    const test = await prisma?.test.create({data:{
        ...values,
        is_public:false,
        test_questions:{
            create:{
                question:[]
            }
        }
    },
    include:{
        test_questions:true,
    }});

    return test;
}

export async function GetTests() {
    return await prisma?.test.findMany({where:{is_public:true},include:{level:true, result:true}})
}

export async function GetEmployeeTests({id}:{id:string}) {

    return await prisma?.test.findMany({where:{author_id:id},include:{level:true, result:true}})
}

export async function GetTestById({id}:{id:string}) {
    return await prisma?.test.findFirst({where:{id}, include:{test_questions:true}})
}

export async function PublishTestById({id}:{id:string}) {
    return await prisma?.test.update({where:{id},data:{is_public:true}})
}

export async function SaveResult({info}:{info:any}) {
    return await prisma?.result.create({data:info})
}

export async function UpdateTestById({id,elements}:{id:string, elements:TestElementInstance[]}) {
    return await prisma?.test_questions.update({where:{test_id:id},data:{question:elements}})
}

export async function AuthEmployee({login,password}:{login:string, password:string}) {
    return await prisma?.employee.findFirst({where:{employee_credentials:{
        login,password
    }}, include:{employee_credentials:true, employee_position:{include:{position:true}}}})
}