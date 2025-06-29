import Navbar from "../componeNts/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
