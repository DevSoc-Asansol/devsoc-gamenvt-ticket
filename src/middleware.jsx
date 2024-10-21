import { NextResponse } from 'next/server'
import { getUser } from './lib/appwrite-server'
import { cookies } from 'next/headers'
 
export async function middleware(request) {
  const user = await getUser()
  if (!user  && request.nextUrl.pathname.startsWith('/registration')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ["/registration"], // Only apply this middleware to the /dashboard route
};