import { UpdateLaptopDto } from '@/dtos/laptopInfos.dto';
import { HttpException } from '@exceptions/HttpException';
import { LaptopInfos, RawLaptopData } from '@interfaces/laptopInfos.interface';
import { requiredProps } from '@utils/laptopRequiredProps';
import laptopInfosModel from '@models/laptopInfos.model';
import commentModel from '@models/comment.model';
import { Comment } from '@/interfaces/comment.interface';

class LaptopService {
  public async addNewLaptops(
    laptopDatas: Array<RawLaptopData>,
  ): Promise<Array<LaptopInfos>> {
    if (!Array.isArray(laptopDatas)) {
      throw new HttpException(400, `Input must be an array of laptops`);
    }
    const laptopExisted = await Promise.all(
      laptopDatas.map((lap) => {
        return laptopInfosModel.findOne({ laptopID: lap.laptopID });
      }),
    );
    for (const laptop of laptopExisted) {
      if (laptop !== null) {
        throw new HttpException(400, `Adding duplicate laptop`);
      }
    }
    const reformattedLaptop = laptopDatas.map((lap) => {
      lap.listInfo.forEach((subInfo) => {
        if (requiredProps.includes(subInfo.label)) {
          lap = { ...lap, [subInfo.label]: subInfo.value };
        }
      });
      delete lap.listInfo;
      return lap;
    });

    try {
      const createdLaptops = await Promise.all(
        reformattedLaptop.map((lap) => {
          return laptopInfosModel.create(lap);
        }),
      );

      return createdLaptops as Array<LaptopInfos>;
    } catch (error) {
      throw new HttpException(400, error);
    }
  }

  public async getAllLaptops(): Promise<Array<LaptopInfos>> {
    const laptops: LaptopInfos[] = await laptopInfosModel.find();
    return laptops;
  }
  public async getLaptopsByPaginating({
    page,
    size,
  }: {
    page: string | number;
    size: string | number;
  }): Promise<Array<LaptopInfos>> {
    page = +page;
    size = +size;
    const skip = (page - 1) * size;
    const laptops: LaptopInfos[] = (await laptopInfosModel
      .find()
      .skip(skip)
      .limit(size)) as LaptopInfos[];
    return laptops;
  }
  public async deleteOne(laptopID: string): Promise<LaptopInfos> {
    const deletedLaptopId: LaptopInfos =
      await laptopInfosModel.findByIdAndDelete(laptopID);
    if (!deletedLaptopId) throw new HttpException(400, "Laptop doesn't exist");
    return deletedLaptopId;

    // ---------> delete all records in db <--------------
    await laptopInfosModel.deleteMany();
    return {} as LaptopInfos;
  }
  public async updateOne(
    laptopID: string,
    laptopInfos: UpdateLaptopDto,
  ): Promise<LaptopInfos> {
    try {
      const updatedLaptopInfos: LaptopInfos =
        await laptopInfosModel.findByIdAndUpdate(laptopID, laptopInfos);
      if (!updatedLaptopInfos)
        throw new HttpException(400, "Laptop doesn't exist");
      return updatedLaptopInfos;
    } catch (error) {
      throw new HttpException(400, "Laptop doesn't exist");
    }
  }

  public async getOneDetail(laptopID: string) {
    try {
      const [currentLaptop, comments] = await Promise.all([
        laptopInfosModel.findById(laptopID),
        commentModel.find({ laptopId: laptopID }),
      ]);

      return [currentLaptop, comments];
    } catch (error) {
      throw new HttpException(400, "Laptop doesn't exist");
    }
  }
}

export default LaptopService;
