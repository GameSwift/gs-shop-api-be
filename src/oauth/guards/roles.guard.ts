import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GSIDSystemRole } from '../oauth.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector, // private readonly usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const handlerRoles = new Set(
            this.reflector.get<Array<GSIDSystemRole>>(
                'roles',
                context.getHandler(),
            ),
        );
        const classRoles = new Set(
            this.reflector.get<Array<GSIDSystemRole>>(
                'roles',
                context.getClass(),
            ),
        );

        const roles = [...handlerRoles, ...classRoles];

        const request = context.switchToHttp().getRequest();

        const user:
            | {
                  id: string;
                  tokenData: {
                      accessTokenExpiresAt: string;
                      refreshTokenExpiresAt: string;
                      scope: Array<string>;
                      clientId: string;
                      userId: string;
                      roles: Array<string>;
                      branches: Array<string>;
                      nickname: string;
                      email: string;
                      avatarUrl: string | null;
                      country: string | null;
                      isTokenValid: boolean;
                  };
              }
            | undefined = request?.user;
        if (user && user.tokenData.isTokenValid) {
            return roles.length > 0
                ? roles.some((role) => user.tokenData.roles.includes(role))
                : true;
        }

        return false;
    }
}
