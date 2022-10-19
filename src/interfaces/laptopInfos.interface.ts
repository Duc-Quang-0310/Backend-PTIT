export interface LaptopInfos {
  _id: string;
  laptopID?: string;
  brand?: string;
  type?: string;
  partNumber?: string;
  color?: string;
  chip?: string;
  chipSet?: string;
  rom?: string;
  connector?: string;
  ram?: string;
  vga?: string;
  disk?: string;
  lightDisk?: string;
  cardReader?: string;
  technology?: string;
  screen?: string;
  webcam?: string;
  audio?: string;
  internet?: string;
  noWires?: string;
  connectionPort?: string;
  battery?: string;
  size?: string;
  weight?: string;
  window?: string;
  accessory?: string;
  updatedAt?: Date;
  review?: string;
}
export type RawLaptopData = Partial<LaptopInfos> & {
  listInfo: Array<Record<string, string>>;
};
