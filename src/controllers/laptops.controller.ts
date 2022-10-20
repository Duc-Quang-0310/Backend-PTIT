import { NextFunction, Request, Response } from 'express';
import { RawLaptopData } from '@interfaces/laptopInfos.interface';
import laptopService from '@services/laptops.service';

class LaptopController {
  public laptopService = new laptopService();

  public createLaptop = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const laptopDatas: Array<RawLaptopData> = req.body;
      const createdLaptops = await this.laptopService.addNewLaptops(
        laptopDatas,
      );
      res.status(201).json({ data: createdLaptops, message: 'Created' });
    } catch (error) {
      next(error);
    }
  };
  public getLaptops = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const laptops = await this.laptopService.getAllLaptops();
      res.status(201).json({ data: laptops });
    } catch (error) {
      next(error);
    }
  };

  public paginatingLaptops = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { page = '1', size = '15' } = req.query as Record<string, string>;
    try {
      const laptops = await this.laptopService.getLaptopsByPaginating({
        page,
        size,
      });
      res.status(201).json({ data: laptops });
    } catch (error) {
      next(error);
    }
  };

  public deleteOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const laptopID = req.params.id;
      const laptop = await this.laptopService.deleteOne(laptopID);
      res.status(201).json({ message: `Deleted laptop ${laptopID}`, laptop });
    } catch (error) {
      next(error);
    }
  };
  public updateOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const laptopID = req.params.id;
      const laptopInfos = req.body;
      const newUpdatedLaptop = await this.laptopService.updateOne(
        laptopID,
        laptopInfos,
      );
      res.status(201).json({
        message: `Updated laptop ${laptopID} successfully`,
        newUpdatedLaptop,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default LaptopController;
