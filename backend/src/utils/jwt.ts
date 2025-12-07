import jwt, { SignOptions, Secret } from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET as string;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || 7200;
const ISSUER = process.env.JWT_ISSUER || "mini-social-app";
const AUDIENCE = process.env.JWT_AUDIENCE || "users";

export interface AccessTokenPayload {
  sub: string;
  email?: string;
}

export const signAccessToken = (userId: string) => {
  const payload = {
    sub: userId, 
    type: 'access'
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: 7200
    }
  );
};

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(
    token,
    ACCESS_SECRET,
    {
      issuer: ISSUER,
      audience: AUDIENCE
    }
  ) as AccessTokenPayload;
}
