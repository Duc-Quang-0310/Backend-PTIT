import { IsOptional } from 'class-validator';

export class AddNewLaptopDto {
  @IsOptional()
  public laptopID: string;

  @IsOptional()
  public brand?: string;

  @IsOptional()
  public type?: string;

  @IsOptional()
  public partNumber?: string;

  @IsOptional()
  public color?: string;

  @IsOptional()
  public chip?: string;

  @IsOptional()
  public chipSet?: string;

  @IsOptional()
  public rom?: string;

  @IsOptional()
  public connector?: string;

  @IsOptional()
  public ram?: string;

  @IsOptional()
  public vga?: string;

  @IsOptional()
  public disk?: string;

  @IsOptional()
  public lightDisk?: string;

  @IsOptional()
  public cardReader?: string;

  @IsOptional()
  public technology?: string;

  @IsOptional()
  public screen?: string;

  @IsOptional()
  public webcam?: string;

  @IsOptional()
  public audio?: string;

  @IsOptional()
  public internet?: string;

  @IsOptional()
  public noWires?: string;

  @IsOptional()
  public connectionPort?: string;

  @IsOptional()
  public battery?: string;

  @IsOptional()
  public size?: string;

  @IsOptional()
  public weight?: string;

  @IsOptional()
  public window?: string;

  @IsOptional()
  public accessory?: string;

  @IsOptional()
  public updatedAt?: Date;

  @IsOptional()
  public review: string;
}

export class UpdateLaptopDto extends AddNewLaptopDto {}
