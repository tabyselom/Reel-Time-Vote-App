"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { API_BASE_URL, SOCKET_URL } from "@/app/constant";

const socket = io(SOCKET_URL);

interface Option {
  id: string;
  text: string;
  votes_count: number;
}

interface Poll {
  id: string;
  question: string;
  options: Option[];
}

export default function VotePage({ params }: { params: { id: string } }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showVotes, setShowVotes] = useState(false);
  const router = useRouter();
  const { id } = params;

  const fetchPoll = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/poll/get/${id}`);
      const result = await response.json();
      setPoll(result);
    } catch (error) {
      console.error("Failed to fetch poll:", error);
    }
  };

  useEffect(() => {
    if (id) fetchPoll();
  }, [id]);

  useEffect(() => {
    socket.on("vote_updated", (data) => {
      console.log("Vote updated for option:", data.optionId);
      fetchPoll();
    });

    return () => {
      socket.off("vote_updated");
    };
  }, []);

  useEffect(() => {
    const storedPollId = localStorage.getItem("pollid");
    if (storedPollId === id) {
      setShowVotes(true);
    }
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption) {
      alert("Please select an option.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/poll/vote/${selectedOption}`,
        { method: "POST" }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Vote submitted!");
        localStorage.setItem("pollid", id);
        setShowVotes(true);
        await fetchPoll();
        // immediately refresh poll data here
        socket.emit("vote_cast", { optionId: selectedOption });
      } else {
        alert(result.error || "Failed to vote.");
        setShowVotes(true);
      }
    } catch (error) {
      console.error("Vote failed:", error);
      alert("Something went wrong.");
    }
  };

  if (!poll) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading poll...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <Typography variant="h4" className="mb-6 font-bold text-white">
        {poll.question}
      </Typography>

      <RadioGroup
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="mb-6"
      >
        {poll.options.map((opt) => (
          <FormControlLabel
            key={opt.id}
            value={opt.id}
            control={<Radio sx={{ color: "white" }} />}
            label={
              <span className="text-white">
                {opt.text}
                {showVotes && (
                  <span className="ml-2 text-gray-300">
                    ({opt.votes_count} votes)
                  </span>
                )}
              </span>
            }
          />
        ))}
      </RadioGroup>

      <div className="flex space-x-4">
        <Button variant="contained" color="primary" onClick={handleVote}>
          Vote
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
