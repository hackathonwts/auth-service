import { Schema as MongoSchema, Types, HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compareSync, hashSync, genSaltSync, genSalt } from 'bcrypt';
import { synchronizeNameFields } from '@helpers/utils.helper';
import { SocialProvider } from '@helpers/social-auth.helper';
import { StatusEnum } from '@common/enum/status.enum';
import { RegistrationType, GenderEnum, PreferredGenderEnum, LookingForEnum, LoginMethod } from '@common/enum/common.enum';

/* ───────── SCHEMA ───────── */
@Schema({ timestamps: true, versionKey: false })
export class User {
  /* 🔐 AUTH / IDENTITY */

  @Prop({ type: String, required: true, index: true })
  fullName: string;

  @Prop({ type: String, index: true })
  firstName: string;

  @Prop({ type: String, index: true })
  lastName: string;

  @Prop({ type: String, index: true })
  email: string;

  @Prop({ type: String, index: true })
  phone: string;

  @Prop({ type: String, index: true })
  userName: string;

  @Prop()
  password?: string;

  @Prop({ type: String, index: true })
  countryCode: string;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  phoneVerified: boolean;

  /* 👤 ROLE & STATUS */

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Role', index: true })
  role: Types.ObjectId | string;

  @Prop({
    type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.Active,
    index: true,
  })
  status: StatusEnum;

  @Prop({ type: String })
  resetPasswordToken: string;

  /* 🔑 AUTH TYPE */

  @Prop({
    type: String,
    enum: Object.values(LoginMethod),
    default: LoginMethod.PHONE,
    index: true,
  })
  loginMethod?: LoginMethod;

  @Prop({
    type: String,
    enum: Object.values(RegistrationType),
    default: RegistrationType.MANUAL,
    index: true,
  })
  registrationType: RegistrationType;

  @Prop({
    type: String,
    enum: Object.values(SocialProvider),
    index: true,
  })
  socialProvider?: SocialProvider;

  @Prop({ type: String, index: true })
  socialProviderId?: string;

  /* 🧍 SOCIAL PROFILE */

  @Prop({
    type: String,
    enum: Object.values(GenderEnum),
    index: true,
  })
  gender: GenderEnum;

  @Prop({ type: String, default: '' })
  dob: string;

  @Prop({ type: String, maxlength: 250 })
  bio: string;

  @Prop({ type: String })
  profileImage: string;

  @Prop({ type: [String], default: [] })
  galleryPhotos: string[];

  /* ❤️ MATCHING PREFERENCES */

  @Prop({
    type: [{ type: MongoSchema.Types.ObjectId, ref: 'Category' }],
    default: [],
    index: true,
  })
  interests: Types.ObjectId[];

  @Prop({
    type: String,
    enum: Object.values(PreferredGenderEnum),
    default: PreferredGenderEnum.ANY,
  })
  preferredGender: PreferredGenderEnum;

  @Prop({
    type: String,
    enum: Object.values(LookingForEnum),
    default: LookingForEnum.BOTH,
    index: true,
  })
  lookingFor: LookingForEnum;

  @Prop({ type: Number, min: 1, max: 100, default: 25 })
  locationRange: number;

  /* 📍 GEO LOCATION */

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0],
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  /* ❓ ONBOARDING QUESTIONS */

  @Prop({
    type: [
      {
        questionId: { type: MongoSchema.Types.ObjectId, ref: 'Question' },
        answer: String,
      },
    ],
    default: [],
  })
  questions: {
    questionId: Types.ObjectId;
    answer: string;
  }[];

  /* 🛂 FACE VERIFICATION */

  @Prop({ type: Boolean, default: false })
  faceVerified: boolean;

  @Prop({ type: String })
  faceVerificationImage: string;

  /* ✅ FLAGS */

  @Prop({ type: Boolean, default: false, index: true })
  isOnboarded: boolean;

  @Prop({ type: Boolean, default: true })
  isProfileVisible: boolean;

  @Prop({ type: Boolean, default: true })
  isAgeVisible: boolean;

  /* 🔔 USER SETTINGS (RESTORED & CLEAN) */

  @Prop({ type: Boolean, default: true })
  emailNotifications: boolean;

  @Prop({ type: Boolean, default: true })
  smsNotifications: boolean;

  @Prop({ type: Boolean, default: true })
  pushNotifications: boolean;

  @Prop({ type: Boolean, default: true })
  emailReminders: boolean;

  @Prop({ type: Boolean, default: true })
  smsReminders: boolean;

  @Prop({ type: Boolean, default: true })
  pushReminders: boolean;

  /* 🗑 SOFT DELETE */

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

/* ───────── SCHEMA SETUP ───────── */

export const UserSchema = SchemaFactory.createForClass(User);

/* ───────── INDEXES ───────── */

// Unique identity
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
UserSchema.index({ socialProvider: 1, socialProviderId: 1 }, { unique: true, sparse: true });

// 2dsphere
UserSchema.index({ location: '2dsphere' });

// Matching & discovery
UserSchema.index({
  gender: 1,
  preferredGender: 1,
  lookingFor: 1,
  isOnboarded: 1,
  isProfileVisible: 1,
});

/* ───────── METHODS ───────── */

UserSchema.methods.validPassword = function (password: string) {
  return this.password ? compareSync(password, this.password) : false;
};

UserSchema.methods.generateHash = function (password: string) {
  return hashSync(password, genSaltSync(+process.env.SALT_ROUND));
};

/* ───────── HOOKS ───────── */

UserSchema.pre('save', async function (next: any) {
  let user = this as Partial<UserDocument>;
  user = synchronizeNameFields(user);
  // Only hash password if it exists and is modified (not required for social auth)
  if (user.password && user.isModified('password')) {
    const salt = await genSalt(10);
    const hash = hashSync(user.password, salt);
    user.password = hash;
  }
  next();
});

UserSchema.pre('findOneAndUpdate', async function (next: any) {
  let update = this.getUpdate() as Partial<UserDocument>;
  if (!update) return next();
  update = synchronizeNameFields(update);
  // Only hash password if it exists in the update
  if (update.password) {
    const salt = await genSalt(10);
    update.password = hashSync(update.password, salt);
  }
  this.setUpdate(update);
  next();
});

/* ───────── TYPES ───────── */

export type UserDocument = HydratedDocument<User> & {
  validPassword(password: string): boolean;
  generateHash(password: string): string;
};
