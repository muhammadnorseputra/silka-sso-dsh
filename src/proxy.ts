import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getSession from "@/services/session";
import { getSessionFromDatabase } from "./services/session-store";

export async function proxy(req: NextRequest) {
  // Retrieve the token from the request
  const sessionFromCookie = await getSession();

  const sessionFromDB = await getSessionFromDatabase(
    sessionFromCookie?.access_token as string,
  );

  if (!sessionFromDB) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("sso_token");
    res.cookies.delete("sso_token_plain");
    return res;
  }

  // Proceed with the request if the session is valid
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/dashboard", "/users", "/settings"],
};
