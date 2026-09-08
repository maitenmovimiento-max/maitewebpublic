import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Uso: pnpm auth:hash "una-clave-de-al-menos-12-caracteres"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
const secret = randomBytes(48).toString("base64url");

console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}`);
console.log(`ADMIN_SESSION_SECRET=${secret}`);
