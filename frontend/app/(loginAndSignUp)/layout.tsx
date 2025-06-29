import Link from "next/link";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="px-5 py-3 bg-slate-950 font-work-sans">
        <nav className="flex justify-center items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/">
              Quick<span className="text-primary">Poll</span>
            </Link>
          </h1>
        </nav>
      </header>
      <main> {children}</main>
    </>
  );
}
