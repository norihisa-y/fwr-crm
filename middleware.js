import { next } from '@vercel/functions'

export const config = {
  matcher: ['/(.*)', '/'],
  runtime: 'edge',
}

export default function middleware(request) {
  const auth = request.headers.get('authorization') || ''

  if (auth.startsWith('Basic ')) {
    try {
      const [user, pass] = atob(auth.slice(6)).split(':')
      if (
        user === process.env.BASIC_AUTH_USER &&
        pass === process.env.BASIC_AUTH_PASS
      ) {
        return next()
      }
    } catch {}
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
  })
}
