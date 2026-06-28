import { NextRequest } from 'next/server';
import AccessToken from "@/data/access-token";
import { AES } from "crypto-js";
import { cookies } from "next/headers";

/**
 * OAuth callback handler
 * Processes authorization code and sets authentication cookies
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const cookieStore = cookies();

  // Validate required parameters
  if (!code) {
    return Response.json(
      { success: false, message: "Authorization code is required" },
      { status: 400 }
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await AccessToken(code);
    
    if (!tokenResponse.response?.status) {
      return Response.json(tokenResponse, { status: 400 });
    }

    const { access_token } = tokenResponse.response;
    const keyPassphrase = process.env.KEY_PASSPHRASE;
    
    if (!keyPassphrase) {
      throw new Error("Encryption key is not configured");
    }

    // Encrypt access token
    const encryptedToken = AES.encrypt(access_token, keyPassphrase).toString();

    // Set encrypted token cookie
    (await
      // Set encrypted token cookie
      cookieStore).set({
      name: "panel_sso_token",
      value: encryptedToken,
      httpOnly: true,
      maxAge: 3600, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Redirect to dashboard
    const dashboardUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(dashboardUrl, 302);
  } catch (error) {
    console.error("OAuth processing error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
