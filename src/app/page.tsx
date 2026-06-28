import LoadingScreen from "@/components/spalsh-screen";
import getSession from "@/services/session";
import { getSessionFromDatabase } from "@/services/session-store";
import { permanentRedirect } from "next/navigation";

export default async function Home() {
  const token = await getSession();
  const session = await getSessionFromDatabase(token?.access_token as string);
  const redirectTo = session
    ? "/dashboard"
    : process.env.SSO_LOGIN_BASE_URL || "http://localhost:3000";

  return <LoadingScreen redirectUrl={redirectTo} />;
}
