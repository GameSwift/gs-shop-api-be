import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExternalTokenInfoData } from '../oauth.api.service';

export interface ICurrentUser {
    id: string;
    tokenData: ExternalTokenInfoData;
}

export const CurrentUser = createParamDecorator(
    (_: string, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();

        return req.user as ICurrentUser;
    },
);
