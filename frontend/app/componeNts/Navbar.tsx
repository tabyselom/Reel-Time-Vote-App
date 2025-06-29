"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Run on client only
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    window.location.reload(); // or use router.push("/") for SPA feel
  };

  return (
    <header className="px-5 py-3 bg-slate-950 font-work-sans">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">
            Quick<span className="text-primary">Poll</span>
          </Link>
        </h1>
        <div className="flex gap-5 items-center">
          {userId ? (
            <>
              <Link href="/create" className="text-white hover:text-primary">
                Create Poll
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white text-2xl hover:text-primary "
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-white text-2xl hover:text-primary"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
