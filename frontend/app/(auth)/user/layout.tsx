import AuthNavbar from "@/components/AuthNavbar";
import { Toaster } from "react-hot-toast";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AuthNavbar />
      {children}
      <Toaster position="top-center" />
    </main>
  );
}
