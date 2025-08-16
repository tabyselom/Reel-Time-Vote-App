"use client";

import Link from "next/link";
import React from "react";

// #0d1b25 bg
//#27d6a1 logo
//#c7c6c4 text

function AuthNavbar() {
  return (
    <div className="flex justify-center items-center text-white bg-[#0d1b25] px-8 py-4">
      <h1 className="text-5xl font-bold">
        <Link href="/">
          Quick<span className="text-[#5bcfb1]">Poll</span>
        </Link>
      </h1>
    </div>
  );
}

export default AuthNavbar;
