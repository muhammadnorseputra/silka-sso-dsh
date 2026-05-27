import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getSession from "@/services/session";
import { getSessionMemory } from "./services/session-store";

export async function proxy(req: NextRequest) {
  // Retrieve the token from the request
  const sessionFromCookie = await getSession();
  const sessionFromMemory = getSessionMemory(
    sessionFromCookie?.cookie?.value as string,
  );

  // Check if the token exists and has the necessary properties
  if (
    !sessionFromCookie ||
    (!sessionFromCookie.cookie.name && !sessionFromMemory)
  ) {
    // Redirect to the homepage if the ses sion is invalid or missing
    return NextResponse.redirect(new URL("/", req.url));
  }
  // Proceed with the request if the session is valid
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/dashboard", "/users", "/settings"],
};
