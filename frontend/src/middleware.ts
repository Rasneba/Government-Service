import { NextRequest, NextResponse } from 'next/server'

const publicPaths = ['/login', '/api', '/citizen/login', '/citizen/register']
const citizenPaths = ['/citizen']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value
  const citizenToken = request.cookies.get('citizenToken')?.value

  const isCitizenPath = citizenPaths.some(p => pathname.startsWith(p))

  if (isCitizenPath) {
    if (!citizenToken) {
      return NextResponse.redirect(new URL('/citizen/login', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
