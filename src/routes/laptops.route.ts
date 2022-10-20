import { Router } from 'express';
import LaptopsController from '@controllers/laptops.controller';
import { Routes } from '@interfaces/routes.interface';

class LaptopsRoute implements Routes {
  public path = '/api/laptop';
  public router = Router();
  public laptopsController = new LaptopsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.laptopsController.createLaptop);
    this.router.get(`${this.path}`, this.laptopsController.getLaptops);
    this.router.get(
      `${this.path}/pagination`,
      this.laptopsController.paginatingLaptops,
    );
    this.router.delete(`${this.path}/:id`, this.laptopsController.deleteOne);
    this.router.put(`${this.path}/:id`, this.laptopsController.updateOne);
  }
}

export default LaptopsRoute;
