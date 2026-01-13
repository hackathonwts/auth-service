import { OAuth2Client, TokenPayload as GoogleTokenPayload } from 'google-auth-library';
import axios from 'axios';
import { jwtVerify, createRemoteJWKSet, type JWTVerifyResult, SignJWT } from 'jose';
import { createPrivateKey } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { join } from 'node:path';
import { promises as fs, createWriteStream } from 'node:fs';
// ---------- Types ----------

export enum SocialProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

// Generic tokens returned by OAuth providers
export interface SocialTokens {
  accessToken: string;
  refreshToken?: string | null;
  idToken?: string | null; // google/apple may return id_token
  expiresIn?: number | null;
}

// Normalized user profile returned by helpers
export interface SocialUserProfile {
  provider: SocialProvider;
  id: string;
  email?: string | null;
  emailVerified?: boolean;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  picture?: string | null;
  raw?: unknown; // raw payload from provider for advanced use
}

// Google specific payload type (small subset)
export type GoogleProfile = Omit<SocialUserProfile, 'provider'> & { provider: SocialProvider.GOOGLE };

// Facebook specific payload type
export type FacebookProfile = Omit<SocialUserProfile, 'provider'> & { provider: SocialProvider.FACEBOOK };

// Apple specific payload type
export type AppleProfile = Omit<SocialUserProfile, 'provider'> & { provider: SocialProvider.APPLE };

// ---------- Image Download Helper ----------

/**
 * Downloads an image from a URL and saves it to a local directory
 * @param imageUrl URL of the image to download
 * @param uploadDir Directory where images should be saved (e.g., './uploads/profiles')
 * @param filename Optional custom filename (auto-generated if not provided)
 * @returns Relative path to the saved image (e.g., 'uploads/profiles/user123.jpg')
 */
export async function downloadAndSaveImage(imageUrl: string, uploadDir: string, filename?: string): Promise<string | null> {
  try {
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate filename if not provided
    if (!filename) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const extension = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
      filename = `social-${timestamp}-${random}.${extension}`;
    }

    const filepath = join(uploadDir, filename);

    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      timeout: 10000, // 10 second timeout
    });

    // Save to file
    const writer = createWriteStream(filepath);
    await pipeline(response.data, writer);

    // Return relative path (adjust this based on your project structure)
    return filepath;
  } catch (err: any) {
    console.error('Failed to download image:', err.message);
    return null; // Return null if download fails, don't break the auth flow
  }
}

// ---------- Google helpers ----------

/**
 * Verifies a Google ID token and returns a normalized profile.
 * @param idToken The id_token returned by Google OAuth
 * @param clientId Your Google OAuth2 client ID (audience validation)
 */
export async function verifyGoogleIdToken(idToken: string, clientId: string): Promise<GoogleProfile> {
  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid Google ID token payload');
    }

    const profile: GoogleProfile = {
      provider: SocialProvider.GOOGLE,
      id: payload.sub!,
      email: payload.email ?? null,
      emailVerified: Boolean(payload.email_verified),
      name: payload.name ?? null,
      firstName: payload.given_name ?? null,
      lastName: payload.family_name ?? null,
      picture: payload.picture ?? null,
      raw: payload as GoogleTokenPayload,
    };
    return profile;
  } catch (err: any) {
    throw new Error(`Google ID token verification failed: ${err.message}`);
  }
}

// ---------- Facebook helpers ----------

interface FacebookMeResponse {
  id: string;
  name?: string;
  email?: string;
  picture?: { data?: { url?: string } };
}

/**
 * Fetches Facebook user profile using a user access token.
 * If you need to validate the token belongs to your app, pass appId & appSecret and the function will also call the debug_token endpoint.
 * @param accessToken User access token
 * @param options Optional object containing appId and appSecret (for token debugging)
 */
export async function getFacebookProfile(accessToken: string, options?: { appId?: string; appSecret?: string }): Promise<FacebookProfile> {
  try {
    // Optional: verify token using app access token
    if (options?.appId && options?.appSecret) {
      const appAccessToken = `${options.appId}|${options.appSecret}`;
      const debugUrl = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appAccessToken)}`;

      try {
        await axios.get(debugUrl);
      } catch (err) {
        const errorMessage = err?.response?.data?.error?.message ?? err.message;
        console.error(`Facebook token debug error: ${errorMessage}`);
        throw new Error('Invalid or unverifiable Facebook access token');
      }
    }

    const fields = 'id,name,email,picture.width(512).height(512)';
    const url = `https://graph.facebook.com/me?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(accessToken)}`;

    const resp = await axios.get<FacebookMeResponse>(url);
    const data = resp.data;

    const profile: FacebookProfile = {
      provider: SocialProvider.FACEBOOK,
      id: data.id,
      email: data.email ?? null,
      emailVerified: !!data.email, // facebook does not provide explicit "email_verified" in this call
      name: data.name ?? null,
      firstName: null,
      lastName: null,
      picture: data.picture?.data?.url ?? null,
      raw: data,
    };
    return profile;
  } catch (err: any) {
    const errorMessage = err?.response?.data?.error?.message ?? err.message;
    throw new Error(`Facebook profile fetch failed: ${errorMessage}`);
  }
}

// ---------- Apple helpers ----------

/**
 * Options required to generate Apple client secret (JWT). This is used when exchanging code for tokens.
 */
export interface AppleClientSecretOptions {
  teamId: string; // Apple Developer Team ID (10-character)
  clientId: string; // Services ID (e.g. com.example.app)
  keyId: string; // Key ID of the private key
  privateKey: string; // The private key (PEM string) obtained from Apple (.p8 contents)
  expiresInSeconds?: number; // how long client secret should be valid (default 6 months)
}

/**
 * Generate Apple client secret (JWT signed with ES256) used at Apple's token endpoint.
 * @returns a signed JWT (client_secret)
 */
export async function generateAppleClientSecret(opts: AppleClientSecretOptions): Promise<string> {
  try {
    const { teamId, clientId, keyId, privateKey } = opts;
    const expiresIn = opts.expiresInSeconds ?? 15777000; // 6 months
    const now = Math.floor(Date.now() / 1000);

    const key = createPrivateKey({
      key: privateKey,
      format: 'pem',
    });

    const clientSecret = await new SignJWT({
      iss: teamId,
      iat: now,
      exp: now + expiresIn,
      aud: 'https://appleid.apple.com',
      sub: clientId,
    })
      .setProtectedHeader({
        alg: 'ES256',
        kid: keyId,
      })
      .sign(key);

    return clientSecret;
  } catch (err: any) {
    throw new Error(`Apple client secret generation failed: ${err.message}`);
  }
}

/**
 * Exchange authorization code for Apple ID token
 * @param code Authorization code from Apple
 * @param clientId Your Services ID
 * @param clientSecret Generated client secret (JWT)
 * @param redirectUri The redirect URI used in the authorization request (optional but recommended)
 */
export async function getAppleIdToken(code: string, clientId: string, clientSecret: string, redirectUri?: string): Promise<string | null> {
  try {
    const params: Record<string, string> = {
      grant_type: 'authorization_code',
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
    };

    // Add redirect_uri if provided (Apple requires this to match the auth request)
    if (redirectUri) {
      params.redirect_uri = redirectUri;
    }

    const tokenResponse = await axios.post('https://appleid.apple.com/auth/token', new URLSearchParams(params), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return tokenResponse.data.id_token ?? null;
  } catch (err: any) {
    const errorMessage = err?.response?.data?.error ?? err.message;
    throw new Error(`Apple token exchange failed: ${errorMessage}`);
  }
}

/**
 * Apple user data structure (only provided on first authorization)
 */
export interface AppleUserData {
  name?: {
    firstName?: string;
    lastName?: string;
  };
  email?: string;
}

/**
 * Verifies an Apple identity token (id_token) using Apple's JWKS and returns a normalized AppleProfile.
 * @param idToken Identity token returned by Apple
 * @param clientId Your Services ID (audience) - required to validate token audience
 */
export async function verifyAppleIdentityToken(idToken: string, clientId: string, userData?: AppleUserData | null): Promise<AppleProfile> {
  try {
    // Create a remote JWK Set which will fetch Apple's keys and cache them.
    const jwks = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));

    const verified: JWTVerifyResult = await jwtVerify(idToken, jwks, {
      issuer: 'https://appleid.apple.com',
      audience: clientId,
    });

    const payload = verified.payload as Record<string, any>;

    // Construct full name if available from userData
    let fullName: string | null = null;
    if (userData?.name?.firstName || userData?.name?.lastName) {
      fullName = [userData.name.firstName, userData.name.lastName].filter(Boolean).join(' ');
    }

    const profile: AppleProfile = {
      provider: SocialProvider.APPLE,
      id: String(payload.sub),
      email: userData?.email ?? payload.email ?? null, // Prefer userData email
      emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
      name: fullName,
      firstName: userData?.name?.firstName ?? null,
      lastName: userData?.name?.lastName ?? null,
      picture: null, // Apple never provides profile pictures
      raw: { ...payload, userData }, // Include both token payload and user data
    };

    return profile;
  } catch (err: any) {
    throw new Error(`Apple identity token verification failed: ${err?.message ?? String(err)}`);
  }
}

// Export default helpers grouped
export const SocialAuthUtils = {
  verifyGoogleIdToken,
  getFacebookProfile,
  generateAppleClientSecret,
  getAppleIdToken,
  verifyAppleIdentityToken,
};
