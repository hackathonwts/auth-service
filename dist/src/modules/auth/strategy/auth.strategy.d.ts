import { Strategy, VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserRepository } from '@modules/user/user.repository';
import { JwtPayloadType } from '@common/types/jwt.type';
import { UserDeviceRepository } from '@modules/user-devices/repository/user-device.repository';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    readonly configService: ConfigService;
    private readonly userRepository;
    private readonly userDeviceRepository;
    constructor(configService: ConfigService, userRepository: UserRepository, userDeviceRepository: UserDeviceRepository);
    validate(req: Request, payload: JwtPayloadType, done: VerifiedCallback): Promise<void>;
}
export {};
