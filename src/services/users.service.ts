import cloudinary from '@/utils/cloudinary';
import { HttpException } from '@exceptions/HttpException';
import { UserProfile } from '@interfaces/users.interface';
import userProfileModel from '@models/profiles.model';
import { v4 } from 'uuid';
import fs from 'fs';

class UserService {
  // public users = userModel;
  public async updateUserProfile(
    userId: string,
    newUserProfile: UserProfile,
  ): Promise<UserProfile> {
    const updatedUserProfile: UserProfile =
      await userProfileModel.findOneAndUpdate({ userId }, newUserProfile, {
        new: true,
      });
    if (!updatedUserProfile) throw new HttpException(409, 'Invalid userId');

    return updatedUserProfile;
  }
  public async uploadImgService(image): Promise<string> {
    const fileLocation = __dirname + image.originalname;
    fs.writeFileSync(fileLocation, image.buffer);
    const imageUrl = await cloudinary.uploadAvatar(fileLocation, v4());
    fs.unlinkSync(fileLocation);
    return imageUrl;
  }
}

export default UserService;
