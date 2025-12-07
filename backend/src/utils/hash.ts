import bcrypt from "bcryptjs";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export async function hashToken(token: string) {
  return bcrypt.hash(token, saltRounds);
}

export async function compareToken(token: string, hash: string) {
  return bcrypt.compare(token, hash);
}
