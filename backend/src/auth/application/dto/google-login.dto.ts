import { IsString, MinLength } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @MinLength(1, { message: 'Google credential không được để trống' })
  credential: string;
}
