import UserInfo from "@/data/user-info";
import { cookies } from "next/headers";

type Session = {
  token: string;
};

const sessions = new Map<string, Session>();

export function createSession(session: Session) {
  sessions.set(session.token, session);
}

export function getSessionMemory(token: string) {
  return sessions.get(token);
}

export async function getSessionFromDatabase(token: string) {
  "use server";
  const cookieLocal = await cookies();
  const session =
    token || (cookieLocal.get("panel_sso_token_plain")?.value as string);

  const sessionDB = await UserInfo({
    access_token: session,
  });

  if (!sessionDB.response.status) {
    return sessionDB.response.status;
  }

  return true;
}
