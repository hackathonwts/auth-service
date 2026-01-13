import { Schema as MongoSchema, Types, HydratedDocument } from 'mongoose';
import { SocialProvider } from '@helpers/social-auth.helper';
import { StatusEnum } from '@common/enum/status.enum';
import { RegistrationType, GenderEnum, PreferredGenderEnum, LookingForEnum, LoginMethod } from '@common/enum/common.enum';
export declare class User {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userName: string;
    password?: string;
    countryCode: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    role: Types.ObjectId | string;
    status: StatusEnum;
    resetPasswordToken: string;
    loginMethod?: LoginMethod;
    registrationType: RegistrationType;
    socialProvider?: SocialProvider;
    socialProviderId?: string;
    gender: GenderEnum;
    dob: string;
    bio: string;
    profileImage: string;
    galleryPhotos: string[];
    interests: Types.ObjectId[];
    preferredGender: PreferredGenderEnum;
    lookingFor: LookingForEnum;
    locationRange: number;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    questions: {
        questionId: Types.ObjectId;
        answer: string;
    }[];
    faceVerified: boolean;
    faceVerificationImage: string;
    isOnboarded: boolean;
    isProfileVisible: boolean;
    isAgeVisible: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    emailReminders: boolean;
    smsReminders: boolean;
    pushReminders: boolean;
    isDeleted: boolean;
}
export declare const UserSchema: MongoSchema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type UserDocument = HydratedDocument<User> & {
    validPassword(password: string): boolean;
    generateHash(password: string): string;
};
