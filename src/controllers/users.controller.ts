import { NextFunction, Request, Response } from 'express';
import { UserProfile } from '@interfaces/users.interface';
import userService from '@services/users.service';
import ProfileModel from '@/models/profiles.model';
import { Profiles } from '@/interfaces/profiles.interface';

class UsersController {
  public userService = new userService();

  public updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId: string = req.params.id;
      const newUserProfile: UserProfile = req.body;
      const newUpdatedUserProfile: UserProfile =
        await this.userService.updateUserProfile(userId, newUserProfile);

      res.status(200).json({ data: newUpdatedUserProfile, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public upLoadImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const image: any = req['files'];
      const currentImg = image.avatar[0];
      const avatarLink = await this.userService.uploadImgService(currentImg);
      res.status(200).json(avatarLink);
    } catch (error) {
      next(error);
    }
  };

  public getProfileById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const profile: Profiles = await ProfileModel.findById(id);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
