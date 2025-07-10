import { V7WelcomeBanner } from "@/components/v7/v7-welcome-banner";

export default function WelcomeBanner({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  return <V7WelcomeBanner theme={theme} />;
}
