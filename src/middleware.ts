import { GetAuth } from '@/action/auth'
import type { NextRequest } from 'next/server'
export async function middleware(request: NextRequest) {
  let credentials = await GetAuth();
  let currentUser = undefined
  if(credentials.login !== '' && credentials.password !== '') currentUser = credentials
 
  if (currentUser && request.nextUrl.pathname.startsWith('/sign-in')) {
    return Response.redirect(new URL('/', request.url))
  }
 
  if (!currentUser && !request.nextUrl.pathname.startsWith('/sign-in')) {
    return Response.redirect(new URL('/sign-in', request.url))
  }
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}