import { NextRequest, NextResponse } from 'next/server'

const publicPaths = ['/login', '/api', '/citizen/login', '/citizen/register', '/police/login']
const citizenPaths = ['/citizen']
const policePaths = ['/police']

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
  const policeToken = request.cookies.get('policeToken')?.value

  const isCitizenPath = citizenPaths.some(p => pathname.startsWith(p))
  const isPolicePath = policePaths.some(p => pathname.startsWith(p))

  if (isPolicePath) {
    if (!policeToken && pathname !== '/police/login') {
      return NextResponse.redirect(new URL('/police/login', request.url))
    }
    return NextResponse.next()
  }

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
