import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica se o cookie 'userCpf' está presente
  const userCpf = request.cookies.get('userCpf')?.value;

  // Se o cookie 'userCpf' não estiver presente, redireciona para a página de login
  if (!userCpf) {
    // Verifica se a rota não é a página de login para evitar loop infinito
    if (request.nextUrl.pathname !== '/LoginPage') {
      return NextResponse.redirect(new URL('/LoginPage', request.url));
    }
  }

  // Continua a navegação se o usuário estiver autenticado ou acessando a página de login
  return NextResponse.next();
}

// Especifica as rotas para aplicar o middleware (ajuste conforme necessário)
export const config = {
  matcher: ['/((?!_next|api|LoginPage).*)'],
};
