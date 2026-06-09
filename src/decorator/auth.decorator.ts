import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
const AuthDecorator = () => SetMetadata(IS_PUBLIC_KEY, true);

export default AuthDecorator;
