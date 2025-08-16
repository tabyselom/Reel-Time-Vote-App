"use client";
import { userStore } from "@/store/userStore";
import { UserStoreType } from "@/types/user.types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

// #0d1b25 bg
//#27d6a1 logo
//#c7c6c4 text

function Navbar() {
  const rout = useRouter();
  const { user, Logout } = userStore() as UserStoreType;

  const logoutHandler = () => {
    Logout();
    rout.push("/");
  };
  return (
    <div className="flex justify-between items-center text-white bg-[#0d1b25] px-8 py-4">
      <h1 className="text-5xl font-bold">
        <Link href="/">
          Quick<span className="text-[#5bcfb1]">Poll</span>
        </Link>
      </h1>

      <div className={` space-x-6 text-3xl flex ${!user ? "hidden" : "flex"} `}>
        <Link href="/user/dashboard">Dashboard</Link>
        <Link href="/poll/create">Create Poll</Link>
      </div>

      <div className="flex space-x-6 text-3xl">
        <Link href="/user/login" className={` ${!user ? "flex" : "hidden"}`}>
          Login
        </Link>
        <Link href="/user/signup" className={` ${!user ? "flex" : "hidden"}`}>
          Signup
        </Link>
        <button
          onClick={logoutHandler}
          className={` ${!user ? "hidden" : "flex"}`}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
