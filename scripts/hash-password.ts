import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

async function main() {
  const prompt = createInterface({ input: stdin, output: stdout });
  const password = await prompt.question("Contraseña nueva del panel (mínimo 12 caracteres): ");
  prompt.close();
  if (!password || password.length < 12) {
    console.error("La contraseña debe tener al menos 12 caracteres.");
    process.exitCode = 1;
    return;
  }

  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  const secret = randomBytes(48).toString("base64url");

  console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}`);
  console.log(`ADMIN_SESSION_SECRET=${secret}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
