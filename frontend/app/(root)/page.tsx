"use client";
import { userStore } from "@/store/userStore";
import { UserStoreType } from "@/types/user.types";
import Link from "next/link";
import { useEffect, useState } from "react";

//#5a88ff button
//#273251 bg
//#5bcfb1 logo
export default function Home() {
  const [pollId, setPollId] = useState<string>("");

  const { CheckUser } = userStore() as UserStoreType;
  useEffect(() => {
    CheckUser();
  }, [CheckUser]);

  return (
    <div className="flex flex-col justify-center items-center h-[80vh] bg-gradient-to-r text-center">
      <h1 className="text-5xl my-4 text-white font-bold">
        Welcome To The Real-Time Poll App
      </h1>
      <p className="text-3xl  text-white my-4 font-medium">
        This application allows you to create and participate in
        <span className="text-[#5bcfb1]"> real-time polls.</span>
      </p>

      <div>
        <input
          type="text"
          placeholder="Enter poll Id"
          value={pollId}
          onChange={(e) => setPollId(e.target.value)}
          className="mt-6 px-4 py-2 border text-white border-gray-300 rounded-md"
        />

        <Link
          href={pollId ? `/poll/vote/${pollId}` : "#"}
          className={`ml-2 px-4 py-2 rounded-md ${
            pollId
              ? "bg-[#27d6a1] hover:bg-white"
              : "bg-gray-400 cursor-not-allowed"
          } text-[#273251] font-medium inline-block`}
        >
          Join Poll
        </Link>

        <Link
          href="/poll/create"
          className="text-2xl font-medium rounded-md mt-6 ml-4 px-4 py-2 bg-[#27d6a1] text-[#273251] hover:bg-white  inline-block"
        >
          Create a Poll
        </Link>
      </div>
    </div>
  );
}
