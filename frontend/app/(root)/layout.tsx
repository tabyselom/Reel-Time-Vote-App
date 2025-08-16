import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function rootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      {children}
      <Toaster position="top-center" />
    </main>
  );
}
