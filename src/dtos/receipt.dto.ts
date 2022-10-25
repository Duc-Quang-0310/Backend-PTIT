import { IsNotEmpty, IsOptional } from 'class-validator';

export class ReceiptDto {
  @IsNotEmpty()
  public userId: string;

  @IsNotEmpty()
  public items: any;

  @IsNotEmpty()
  public cash: string;

  @IsOptional()
  public lastModify?: Date;

  @IsNotEmpty()
  public telephone: string;

  @IsNotEmpty()
  public address: string;

  @IsNotEmpty()
  public quantity: number[];
}
