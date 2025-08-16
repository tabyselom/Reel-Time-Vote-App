"use client";

import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { userStore } from "@/store/userStore";
import { pollStore } from "@/store/pollStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserStoreType } from "@/types/user.types";
import { PollStoreType } from "@/types/poll.types";

function DashboardPage() {
  const { user, CheckUser, Logout } = userStore() as UserStoreType;
  const { myPolls, GetMyPoll } = pollStore() as PollStoreType;
  const router = useRouter();

  useEffect(() => {
    CheckUser();
    if (!user) {
      router.push("/user/login");
    }
    GetMyPoll();
  }, [GetMyPoll, user, router, CheckUser]);

  console.log(myPolls);

  function getMostVotedOption(Option: { text: string; votesCount: number }[]) {
    if (!Option || Option.length === 0) return null;
    let maxVotes = -1;
    let mostVoted = null;
    for (const opt of Option) {
      if (opt.votesCount > maxVotes) {
        maxVotes = opt.votesCount;
        mostVoted = opt;
      }
    }
    if (mostVoted && mostVoted.votesCount > 0) {
      return { text: mostVoted.text, votes: mostVoted.votesCount };
    }
    return null;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]  text-white px-4 py-8 space-y-8">
      {/* Welcome Message */}
      <Typography variant="h3" className="text-green-400 font-bold text-center">
        {/* Welcome, {user.name} 👋 */}
      </Typography>

      {/* Polls List */}
      <Box className="w-full max-w-2xl space-y-6">
        {myPolls && myPolls.length > 0 ? (
          myPolls.map((poll) => {
            const mostVoted = getMostVotedOption(poll.Option);
            const totalVotes = poll.Option.reduce(
              (sum, opt) => sum + opt.votesCount,
              0
            );
            return (
              <Card
                key={poll.id}
                sx={{
                  bgcolor: "#1c394c",
                  border: "1px solid #5bcfb1",
                  borderRadius: 2,
                  padding: 3,
                }}
              >
                <CardContent className="space-y-3">
                  <Typography variant="h5" className="text-white font-bold">
                    📊 {poll.question}
                  </Typography>

                  {mostVoted ? (
                    <Typography className="text-green-400">
                      🏆 Most Voted: <strong>{mostVoted.text}</strong> (
                      {mostVoted.votes} out of {totalVotes})
                    </Typography>
                  ) : (
                    <Typography className="text-yellow-400">
                      No votes yet
                    </Typography>
                  )}

                  <Typography className="text-blue-300">
                    Total Votes: <strong>{totalVotes}</strong>
                  </Typography>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography className="text-white text-center">
            No polls created yet.
          </Typography>
        )}
      </Box>

      <Divider sx={{ bgcolor: "#5bcfb1", width: "60%", marginY: 4 }} />

      {/* Buttons */}
      <Box className="flex flex-col space-y-4 w-full max-w-sm">
        <Button
          variant="contained"
          sx={{ backgroundColor: "#5bcfb1", color: "#112330" }}
          component={Link}
          href="/poll/create"
          fullWidth
        >
          Create New Poll
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#e63946", color: "#fff" }}
          onClick={() => {
            Logout();
            router.push("/user/login");
          }}
          fullWidth
        >
          Logout
        </Button>
      </Box>
    </div>
  );
}

export default DashboardPage;
