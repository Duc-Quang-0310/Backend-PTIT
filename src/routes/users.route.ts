import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 8000000 /** Max size file upload is 8MB */ },
});

const uploader = upload.fields([{ name: 'avatar', maxCount: 1 }]);

class UsersRoute implements Routes {
  public path = '/api/profile';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(UpdateUserDto, 'body'),
      this.usersController.updateUserProfile,
    );

    this.router.post(
      `${this.path}/avatar-upload`,
      uploader,
      this.usersController.upLoadImage,
    );

    this.router.get(`${this.path}/:id`, this.usersController.getProfileById);
  }
}

export default UsersRoute;
