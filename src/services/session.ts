"use server";

import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AES, enc } from "crypto-js";

export default async function getSession() {
  const getCookie = await cookies();

  const cookie = getCookie.get("panel_sso_token");
  const access_token = getCookie.get("panel_sso_token_plain")?.value as string;

  if (cookie?.name && cookie.value) {
    const tokenDycript = AES.decrypt(
      cookie.value,
      process.env.KEY_PASSPHRASE as string,
    ).toString(enc.Utf8);
    const decoded = jwtDecode<JwtPayload>(tokenDycript);
    return {
      cookie,
      decoded,
      access_token,
    };
  }
}

export async function clearSession() {
  const getCookie = await cookies();

  const cookie = getCookie.get("panel_sso_token");
  if (cookie?.name && cookie.value) {
    getCookie.delete("panel_sso_token");
  }
}
