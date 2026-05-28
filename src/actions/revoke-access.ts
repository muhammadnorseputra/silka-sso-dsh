"use server";

import { cookies } from "next/headers";
import RevokeToken, { RevokeTokenChannel } from "@/data/revoke-token";
import { AES, enc } from "crypto-js";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface Payload extends JwtPayload {
  data: { nip: string } & Record<string, unknown>;
}

export async function RevokeAccess() {
  const cookieStore = await cookies();

  // access_token
  const accessToken = cookieStore.get("panel_sso_token");
  const getToken = AES.decrypt(
    accessToken?.value as string,
    process.env.KEY_PASSPHRASE as string,
  ).toString(enc.Utf8);
  const access_token_decode = jwtDecode<Payload>(getToken);
  const { nip } = access_token_decode.data;

  const revoke = await RevokeToken(nip, getToken);
  if (!revoke.response.status) {
    return {
      status: revoke.response.status,
      message: revoke.response.message,
    };
  }

  cookieStore.delete("panel_sso_token");
  cookieStore.delete("panel_sso_token_plain");
  return {
    status: revoke.response.status,
    message: revoke.response.message,
  };
}

export async function BackChannel() {
  const cookieStore = await cookies();

  // access_token
  const accessToken = cookieStore.get("panel_sso_token_plain")?.value as string;

  const revoke = await RevokeTokenChannel(accessToken);
  return {
    status: revoke.response.status,
    message: revoke.response.message,
  };
}
