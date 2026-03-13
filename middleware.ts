import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  
  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  
  const authValue = authHeader.split(' ')[1];
  const [user, pwd] = atob(authValue).split(':');

 
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASS || 'admin123';

  
  if (user === validUser && pwd === validPass) {
    return NextResponse.next();
  }

 
  return new NextResponse('Authentication failed', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  });
}


export const config = {
  matcher: '/admin/:path*',
};