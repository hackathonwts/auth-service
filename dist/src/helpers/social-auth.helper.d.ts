export declare enum SocialProvider {
    GOOGLE = "google",
    FACEBOOK = "facebook",
    APPLE = "apple"
}
export interface SocialTokens {
    accessToken: string;
    refreshToken?: string | null;
    idToken?: string | null;
    expiresIn?: number | null;
}
export interface SocialUserProfile {
    provider: SocialProvider;
    id: string;
    email?: string | null;
    emailVerified?: boolean;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    picture?: string | null;
    raw?: unknown;
}
export type GoogleProfile = Omit<SocialUserProfile, 'provider'> & {
    provider: SocialProvider.GOOGLE;
};
export type FacebookProfile = Omit<SocialUserProfile, 'provider'> & {
    provider: SocialProvider.FACEBOOK;
};
export type AppleProfile = Omit<SocialUserProfile, 'provider'> & {
    provider: SocialProvider.APPLE;
};
export declare function downloadAndSaveImage(imageUrl: string, uploadDir: string, filename?: string): Promise<string | null>;
export declare function verifyGoogleIdToken(idToken: string, clientId: string): Promise<GoogleProfile>;
export declare function getFacebookProfile(accessToken: string, options?: {
    appId?: string;
    appSecret?: string;
}): Promise<FacebookProfile>;
export interface AppleClientSecretOptions {
    teamId: string;
    clientId: string;
    keyId: string;
    privateKey: string;
    expiresInSeconds?: number;
}
export declare function generateAppleClientSecret(opts: AppleClientSecretOptions): Promise<string>;
export declare function getAppleIdToken(code: string, clientId: string, clientSecret: string, redirectUri?: string): Promise<string | null>;
export interface AppleUserData {
    name?: {
        firstName?: string;
        lastName?: string;
    };
    email?: string;
}
export declare function verifyAppleIdentityToken(idToken: string, clientId: string, userData?: AppleUserData | null): Promise<AppleProfile>;
export declare const SocialAuthUtils: {
    verifyGoogleIdToken: typeof verifyGoogleIdToken;
    getFacebookProfile: typeof getFacebookProfile;
    generateAppleClientSecret: typeof generateAppleClientSecret;
    getAppleIdToken: typeof getAppleIdToken;
    verifyAppleIdentityToken: typeof verifyAppleIdentityToken;
};
