import getSession from "@/services/session";
import { permanentRedirect, unauthorized } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session) {
    return permanentRedirect("/dashboard");
  }

  return unauthorized();
}
