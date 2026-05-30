import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LookupSbdParamDto {
  @IsString()
  @IsNotEmpty({ message: 'Số báo danh không được để trống' })
  @Matches(/^\d{8}$/, { message: 'Số báo danh phải gồm đúng 8 chữ số' })
  sbd: string;
}
