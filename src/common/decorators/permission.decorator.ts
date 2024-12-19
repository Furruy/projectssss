import { SetMetadata } from '@nestjs/common';

import { PermissionsEnum } from '../enums/permission.enum';

export const Permissions = (...permissions: PermissionsEnum[]) => SetMetadata('permissions', permissions);
