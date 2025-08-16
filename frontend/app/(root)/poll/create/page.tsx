"use client";

import React, { useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { userStore } from "@/store/userStore";
import { UserStoreType } from "@/types/user.types";
import { pollStore } from "@/store/pollStore";
import Link from "next/link";
import { PollStoreType } from "@/types/poll.types";

function CreatePage() {
  const { user, CheckUser } = userStore() as UserStoreType;
  const { poll, CreatePoll, isCreatingPoll } = pollStore() as PollStoreType;
  const router = useRouter();

  useEffect(() => {
    CheckUser();
  }, [CheckUser]);

  const isLoggedIn = user;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const question = form.question.value;
    const options: string[] = form.options.value
      .split(",")
      .map((opt: string) => opt.trim());

    if (!question || options.length < 2) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const data = {
      question,
      options,
    };
    console.log(data);
    CreatePoll(data);
  };

  const handleCopy = () => {
    if (poll?.id) {
      navigator.clipboard.writeText(`/poll/vote/${poll.id}`);
      alert("Poll link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {isLoggedIn ? (
        !poll ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-md space-y-6"
            sx={{
              padding: 5,
              bgcolor: "#112330",
              boxShadow: "0px 0px 24px 2px rgba(91,207,177,0.63)",
              borderRadius: 3,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              className=" text-center pb-8 font-bold text-white"
              variant="h3"
            >
              Create Poll
            </Typography>
            <TextField
              label="Poll Question"
              required
              fullWidth
              name="question"
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#5bcfb1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5bcfb1", // Yellow on focus
                  },
                },
              }}
            />

            <TextField
              label="Options (comma separated)"
              required
              name="options"
              fullWidth
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#5bcfb1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5bcfb1", // Yellow on focus
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isCreatingPoll}
              sx={{
                backgroundColor: "#5bcfb1",
                color: "#112330",
              }}
            >
              {isCreatingPoll ? "Creating..." : "Create Poll"}
            </Button>
          </Box>
        ) : (
          <div className="flex flex-col items-center space-y-4 mt-8">
            <Typography variant="h3" className="text-green-400 ">
              🎉 Poll created successfully!
            </Typography>
            <Typography variant="h5" className="text-white p-5">
              Poll ID: <span className="text-blue-400">{poll.id}</span>
            </Typography>
            <Typography className="text-white text-center" variant="h5">
              Share this link: <br />
              <a
                href={`${process.env.NEXT_PUBLIC_FRONT_URL}/poll/vote/${poll.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {process.env.NEXT_PUBLIC_FRONT_URL}/poll/vote/{poll.id}
              </a>
            </Typography>
            <Button onClick={handleCopy} variant="outlined" color="secondary">
              Copy Link
            </Button>

            <Button
              onClick={() => {
                router.push("/");
              }}
              variant="contained"
              color="primary"
            >
              Back to Home
            </Button>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <Typography variant="h5" className="text-white">
            To create a poll you need to log in
          </Typography>
          <div className="flex space-x-4">
            <Link href="/user/signup">
              <Button variant="outlined" color="primary">
                Sign Up
              </Button>
            </Link>
            <Link href="/user/login">
              <Button variant="contained" color="primary">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      )}
      `
    </div>
  );
}

export default CreatePage;
