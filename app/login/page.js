import AuthPage from "../../components/AuthPage.js";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  return <AuthPage verificationRequested={params?.verify === "1"} />;
}
