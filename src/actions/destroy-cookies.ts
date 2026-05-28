"use server";

import { cookies } from "next/headers";

export async function destroyCookies() {
  const cookieStore = await cookies();

  cookieStore.delete("panel_sso_token");
  cookieStore.delete("sso_code");
}
