import getSession from "@/services/session";
import { getSessionFromDatabase } from "@/services/session-store";
import { permanentRedirect, unauthorized } from "next/navigation";

export default async function Home() {
  const token = await getSession();
  const session = await getSessionFromDatabase(token?.access_token as string);

  if (session) {
    return permanentRedirect("/dashboard");
  }

  return unauthorized();
}
