'use server'

import { cookies } from 'next/headers'
import type { employee_credentials } from "@prisma/client"
import { AuthEmployee } from './test'
import { redirect } from 'next/navigation'

export async function SetAuth({employee}:{employee:employee_credentials}) {
    const cookieStore = cookies()
    cookieStore.set('login',employee.login, {httpOnly:true})
    cookieStore.set('password',employee.password, {httpOnly:true})
}

export async function GetAuth() {
    const cookieStore = cookies()
    const login = cookieStore.get('login')?.value ?? '';
    const password = cookieStore.get('password')?.value ?? '';
    return {login, password}
}

export async function CheckAuth() {
    return await AuthEmployee(await GetAuth())
}

export async function ClearAuth() {
    const cookieStore = cookies()
    cookieStore.delete('login');
    cookieStore.delete('password');
    redirect('/sign-in')
}