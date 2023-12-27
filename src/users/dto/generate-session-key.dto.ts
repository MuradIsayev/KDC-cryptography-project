import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateSessionKeyDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  receiver: string;
}
