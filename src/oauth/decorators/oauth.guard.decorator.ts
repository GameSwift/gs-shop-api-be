import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OauthGuard } from '../guards/oauth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { GSIDSystemRole } from '../oauth.enum';
import { Roles } from './roles.decorator';

export const UseOauthGuard = (...roles: Array<GSIDSystemRole>) =>
    applyDecorators(
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized user' }),
        ...(roles?.length > 0
            ? [Roles(...roles), UseGuards(OauthGuard, RolesGuard)]
            : [UseGuards(OauthGuard)]),
    );
