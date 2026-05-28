import CodeVerify from "@/data/code-verify";
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

  const userinfo = await CodeVerify(code);
  if (userinfo.response.status) {
    const tokenEnkripsi = AES.encrypt(
      userinfo.response.data.access_token,
      process.env.KEY_PASSPHRASE as string,
    );
    // ACCESS TOKEN ENKRIPSI
    cookieStore.set({
      name: "panel_sso_token",
      value: tokenEnkripsi.toString(),
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600,
      secure: process.env.NODE_ENV === "production",
    });

    // ACCESS TOKEN PLAIN
    cookieStore.set({
      name: "panel_sso_token_plain",
      value: userinfo.response.data.access_token,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600,
      secure: process.env.NODE_ENV === "production",
    });

    return Response.redirect(`${fullHost}/dashboard`, 302);
  }

  return Response.json(userinfo);
}
