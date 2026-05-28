import AccessToken from "@/data/access-token";
import { createSession } from "@/services/session-store";
import { AES } from "crypto-js";
import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: any) {
  const { host, protocol, searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  // const scope = searchParams.get("scope");
  const cookieStore = await cookies();

  const fullHost = `${protocol}//${host}`; // Contoh: http://localhost:3000

  if (!code) {
    return Response.json(
      { status: false, message: "Code not provide" },
      { status: 400 },
    );
  }

  const userinfo = await AccessToken(code);
  if (userinfo.response.status) {
    const tokenEnkripsi = AES.encrypt(
      userinfo.response.access_token,
      process.env.KEY_PASSPHRASE as string,
    );
    // ACCESS TOKEN ENKRIPSI
    cookieStore.set({
      name: "sso_token",
      domain:
        process.env.NODE_ENV === "production"
          ? "silka-sso-panel.vercel.app"
          : "localhost",
      value: tokenEnkripsi.toString(),
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600,
      secure: process.env.NODE_ENV === "production",
    });

    // ACCESS TOKEN PLAIN
    cookieStore.set({
      name: "sso_token_plain",
      domain:
        process.env.NODE_ENV === "production"
          ? "silka-sso-panel.vercel.app"
          : "localhost",
      value: userinfo.response.access_token,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600,
      secure: process.env.NODE_ENV === "production",
    });

    createSession({ token: userinfo.response.access_token });
    return Response.redirect(`${fullHost}/dashboard`, 302);
  }

  return Response.json(userinfo);
}
