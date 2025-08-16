"use client";

import { use, useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Option, PollStoreType } from "@/types/poll.types";
import { pollStore } from "@/store/pollStore";

const VotePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { poll, GetPoll, VotePoll, hasVoted } = pollStore() as PollStoreType;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const pollQuestion: string = poll?.question || "Loading...";
  const options: Option[] = poll?.Option.map((opt) => opt) || [];

  const { id } = use(params);

  useEffect(() => {
    GetPoll(id);
  }, [id, GetPoll]);

  const handleVote = async (option: string) => {
    setSelectedOption(option);
    await VotePoll(option);
    await GetPoll(id);
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-[80vh] text-white px-4">
      {/* Question */}
      <Typography
        variant="h4"
        className="p-8 text-center font-bold text-yellow-400"
      >
        {pollQuestion}
      </Typography>
      {/* Options */}
      <Box className="grid grid-cols-2  justify-around space-x-5 space-y-6 w-full max-w-md">
        {options.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={hasVoted}
            fullWidth
            sx={{
              margin: "8px",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "20px",
              borderColor: "#ccc",
              color: "#fff",
              backgroundColor:
                selectedOption === option.id ? "#facc15" : "transparent",
              "&:hover": {
                backgroundColor: hasVoted ? "transparent" : "#facc15",
                color: hasVoted ? "#fff" : "#000",
              },
              "&.Mui-disabled": {
                opacity: 1, // prevent default grey-out
                color: "#5bcfb1",
                borderColor: "#5bcfb1",
                backgroundColor: "transparent",
              },
            }}
            variant={selectedOption === option.id ? "contained" : "outlined"}
          >
            {option.text}
            {hasVoted && (
              <Typography
                // variant="h5"
                sx={{ marginLeft: "10px", fontSize: "26px" }}
              >
                {option.votesCount}
              </Typography>
            )}
          </Button>
        ))}
      </Box>
      {hasVoted && (
        <Typography variant="h4" className="pt-6 text-white font-bold">
          Total votes:{" "}
          <span className="text-[#5bcfb1]">
            {options.reduce((acc, opt) => acc + opt.votesCount, 0)}
          </span>
        </Typography>
      )}
    </Box>
  );
};

export default VotePage;
