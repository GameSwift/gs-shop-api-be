import { SetMetadata } from '@nestjs/common';
import { GSIDSystemRole } from '../oauth.enum';

export const Roles = (...roles: GSIDSystemRole[]) =>
    SetMetadata('roles', roles);
