import { Matches } from 'class-validator';

export class ChangePasswordDto {
  @Matches(/^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/)
  oldPassword!: string;

  @Matches(/^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/, {
    message: 'Weak password',
  })
  newPassword!: string;
}
