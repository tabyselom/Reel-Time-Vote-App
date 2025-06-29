"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [pollId, setPollId] = useState("");

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r text-center">
      <h1 className="text-5xl font-bold">Welcome to the Real-Time Poll App</h1>
      <p className="text-3xl mt-4 font-medium">
        This application allows you to create and participate in real-time
        polls.
      </p>

      <div>
        <input
          type="text"
          placeholder="Enter poll Id"
          value={pollId}
          onChange={(e) => setPollId(e.target.value)}
          className="mt-6 px-4 py-2 border border-gray-300 rounded-md"
        />

        <Link
          href={pollId ? `/vote/${pollId}` : "#"}
          className={`ml-2 px-4 py-2 rounded-md ${
            pollId
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white inline-block`}
        >
          Join Poll
        </Link>

        <Link
          href="/create"
          className="text-2xl rounded-md mt-6 ml-4 px-4 py-2 bg-purple-950 text-white hover:bg-blue-600 inline-block"
        >
          Create a Poll
        </Link>
      </div>
    </div>
  );
}
