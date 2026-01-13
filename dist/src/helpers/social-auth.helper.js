"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthUtils = exports.SocialProvider = void 0;
exports.downloadAndSaveImage = downloadAndSaveImage;
exports.verifyGoogleIdToken = verifyGoogleIdToken;
exports.getFacebookProfile = getFacebookProfile;
exports.generateAppleClientSecret = generateAppleClientSecret;
exports.getAppleIdToken = getAppleIdToken;
exports.verifyAppleIdentityToken = verifyAppleIdentityToken;
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const jose_1 = require("jose");
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:stream/promises");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
var SocialProvider;
(function (SocialProvider) {
    SocialProvider["GOOGLE"] = "google";
    SocialProvider["FACEBOOK"] = "facebook";
    SocialProvider["APPLE"] = "apple";
})(SocialProvider || (exports.SocialProvider = SocialProvider = {}));
async function downloadAndSaveImage(imageUrl, uploadDir, filename) {
    try {
        await node_fs_1.promises.mkdir(uploadDir, { recursive: true });
        if (!filename) {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            const extension = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
            filename = `social-${timestamp}-${random}.${extension}`;
        }
        const filepath = (0, node_path_1.join)(uploadDir, filename);
        const response = await axios_1.default.get(imageUrl, {
            responseType: 'stream',
            timeout: 10000,
        });
        const writer = (0, node_fs_1.createWriteStream)(filepath);
        await (0, promises_1.pipeline)(response.data, writer);
        return filepath;
    }
    catch (err) {
        console.error('Failed to download image:', err.message);
        return null;
    }
}
async function verifyGoogleIdToken(idToken, clientId) {
    try {
        const client = new google_auth_library_1.OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({ idToken, audience: clientId });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid Google ID token payload');
        }
        const profile = {
            provider: SocialProvider.GOOGLE,
            id: payload.sub,
            email: payload.email ?? null,
            emailVerified: Boolean(payload.email_verified),
            name: payload.name ?? null,
            firstName: payload.given_name ?? null,
            lastName: payload.family_name ?? null,
            picture: payload.picture ?? null,
            raw: payload,
        };
        return profile;
    }
    catch (err) {
        throw new Error(`Google ID token verification failed: ${err.message}`);
    }
}
async function getFacebookProfile(accessToken, options) {
    try {
        if (options?.appId && options?.appSecret) {
            const appAccessToken = `${options.appId}|${options.appSecret}`;
            const debugUrl = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appAccessToken)}`;
            try {
                await axios_1.default.get(debugUrl);
            }
            catch (err) {
                const errorMessage = err?.response?.data?.error?.message ?? err.message;
                console.error(`Facebook token debug error: ${errorMessage}`);
                throw new Error('Invalid or unverifiable Facebook access token');
            }
        }
        const fields = 'id,name,email,picture.width(512).height(512)';
        const url = `https://graph.facebook.com/me?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(accessToken)}`;
        const resp = await axios_1.default.get(url);
        const data = resp.data;
        const profile = {
            provider: SocialProvider.FACEBOOK,
            id: data.id,
            email: data.email ?? null,
            emailVerified: !!data.email,
            name: data.name ?? null,
            firstName: null,
            lastName: null,
            picture: data.picture?.data?.url ?? null,
            raw: data,
        };
        return profile;
    }
    catch (err) {
        const errorMessage = err?.response?.data?.error?.message ?? err.message;
        throw new Error(`Facebook profile fetch failed: ${errorMessage}`);
    }
}
async function generateAppleClientSecret(opts) {
    try {
        const { teamId, clientId, keyId, privateKey } = opts;
        const expiresIn = opts.expiresInSeconds ?? 15777000;
        const now = Math.floor(Date.now() / 1000);
        const key = (0, node_crypto_1.createPrivateKey)({
            key: privateKey,
            format: 'pem',
        });
        const clientSecret = await new jose_1.SignJWT({
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
    }
    catch (err) {
        throw new Error(`Apple client secret generation failed: ${err.message}`);
    }
}
async function getAppleIdToken(code, clientId, clientSecret, redirectUri) {
    try {
        const params = {
            grant_type: 'authorization_code',
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
        };
        if (redirectUri) {
            params.redirect_uri = redirectUri;
        }
        const tokenResponse = await axios_1.default.post('https://appleid.apple.com/auth/token', new URLSearchParams(params), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return tokenResponse.data.id_token ?? null;
    }
    catch (err) {
        const errorMessage = err?.response?.data?.error ?? err.message;
        throw new Error(`Apple token exchange failed: ${errorMessage}`);
    }
}
async function verifyAppleIdentityToken(idToken, clientId, userData) {
    try {
        const jwks = (0, jose_1.createRemoteJWKSet)(new URL('https://appleid.apple.com/auth/keys'));
        const verified = await (0, jose_1.jwtVerify)(idToken, jwks, {
            issuer: 'https://appleid.apple.com',
            audience: clientId,
        });
        const payload = verified.payload;
        let fullName = null;
        if (userData?.name?.firstName || userData?.name?.lastName) {
            fullName = [userData.name.firstName, userData.name.lastName].filter(Boolean).join(' ');
        }
        const profile = {
            provider: SocialProvider.APPLE,
            id: String(payload.sub),
            email: userData?.email ?? payload.email ?? null,
            emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
            name: fullName,
            firstName: userData?.name?.firstName ?? null,
            lastName: userData?.name?.lastName ?? null,
            picture: null,
            raw: { ...payload, userData },
        };
        return profile;
    }
    catch (err) {
        throw new Error(`Apple identity token verification failed: ${err?.message ?? String(err)}`);
    }
}
exports.SocialAuthUtils = {
    verifyGoogleIdToken,
    getFacebookProfile,
    generateAppleClientSecret,
    getAppleIdToken,
    verifyAppleIdentityToken,
};
