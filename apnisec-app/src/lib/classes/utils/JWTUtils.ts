import jwt from "jsonwebtoken";
import { IJWTPayload, IAuthTokens } from "../../types";
import { UnauthorizedError } from "../errors/AppError";

export class JWTUtil {
    private static readonly ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
    private static readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
    private static readonly ACCESS_TOKEN_EXPIRY = '1d';
    private static readonly REFRESH_TOKEN_EXPIRY = '7d';

    static generateTokens(payload: IJWTPayload): IAuthTokens {
        if (!this.ACCESS_TOKEN_SECRET || !this.REFRESH_TOKEN_SECRET) {
            throw new Error("Token secrets not configured");
        }
        const accessToken = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
            expiresIn: this.ACCESS_TOKEN_EXPIRY,
        });

        const refreshToken = jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
            expiresIn: this.REFRESH_TOKEN_EXPIRY,
        });

        return { accessToken, refreshToken };
    }

    static generateAccessToken(payload: IJWTPayload): string {
        if (!this.ACCESS_TOKEN_SECRET) {
            throw new Error("Access token secret not configured");
        }
        return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
            expiresIn: this.ACCESS_TOKEN_EXPIRY,
        });
    }

    static verifyAccessToken(token: string): IJWTPayload {
        try {
            if (!this.ACCESS_TOKEN_SECRET) {
                throw new Error("Access token secret not configured");
            }
            const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as IJWTPayload;
            return decoded;
        } catch (error) {
            throw new UnauthorizedError('Invalid access token');
        }
    }

    static extractTokenFromHeader(authHeader: string): string {
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedError('Invalid authorization header');
        }
        return parts[1];
    }
}

