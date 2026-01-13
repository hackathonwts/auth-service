import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { UserRepository } from '@modules/user/user.repository';
import { JwtPayloadType } from '@common/types/jwt.type';
import { UserDeviceRepository } from '@modules/user-devices/repository/user-device.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userDeviceRepository: UserDeviceRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayloadType, done: VerifiedCallback) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1]; // Removes "Bearer "

    const tokenData = await this.userDeviceRepository.getByField({
      accessToken: token,
      expired: false,
      isLoggedOut: false,
      isDeleted: false,
    });
    const lastSegment = req.originalUrl.split('/').pop();

    if (tokenData?._id || lastSegment === 'logout') {
      const { userId } = payload;

      const user = await this.userRepository.getUserDetails(userId);
      if (!user) return done(new UnauthorizedException(), false);

      return done(null, user, payload.iat);
    } else {
      throw new UnauthorizedException('Token has been invalidated. Please log in again.');
    }
  }
}
