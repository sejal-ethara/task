import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signToken(payload: SessionPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function setSessionToken(payload: SessionPayload) {
  const token = await signToken(payload);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

export async function clearSession() {
  cookies().delete("token");
}
