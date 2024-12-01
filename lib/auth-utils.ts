import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

export class AuthUtils {
  static async getAuthUser(): Promise<AuthUser | null> {
    const session = await auth();
    if (session?.user && session.user.id) {
      return {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || null
      };
    }
    return null;
  }
}

export function withAuth(handler: (req: Request, user: AuthUser) => Promise<NextResponse>) {
  return async function (request: Request) {
    const user = await AuthUtils.getAuthUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(request, user);
  };
}
