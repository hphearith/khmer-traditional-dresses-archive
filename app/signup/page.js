import AuthPage from "../../components/AuthPage.js";

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;

  return <AuthPage signup verificationRequested={params?.verify === "1"} />;
}
