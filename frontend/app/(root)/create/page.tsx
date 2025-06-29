"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type PollFormInputs = {
  question: string;
  options: string;
};

export default function CreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PollFormInputs>();
  const [pollId, setPollId] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: PollFormInputs) => {
    try {
      const res = await fetch("http://localhost:5000/api/poll/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: data.question,
          userId: localStorage.getItem("userId"),
          options: data.options.split(",").map((option) => option.trim()),
        }),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Poll created successfully:", result.poll.id);
        setPollId(result.poll.id);
      } else {
        const error = await res.json();
        console.error("Error creating poll:", error);
        alert(error.message || "Failed to create poll");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error, please try again.");
    }
  };

  const handleCopy = () => {
    if (pollId) {
      navigator.clipboard.writeText(`http://localhost:3000/vote/${pollId}`);
      alert("Poll link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <Typography variant="h4" className="mb-6 font-bold text-white">
        Create Poll
      </Typography>

      {!pollId ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6"
        >
          <TextField
            label="Poll Question"
            {...register("question", { required: "Question is required" })}
            error={!!errors.question}
            helperText={errors.question?.message}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          <TextField
            label="Options (comma separated)"
            {...register("options", {
              required: "At least one option is required",
            })}
            error={!!errors.options}
            helperText={errors.options?.message}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center space-y-4 mt-8">
          <Typography variant="h6" className="text-green-400">
            🎉 Poll created successfully!
          </Typography>

          <Typography className="text-white">
            Poll ID: <span className="text-blue-400">{pollId}</span>
          </Typography>

          <Typography className="text-white">
            Share this link: <br />
            <a
              href={`http://localhost:3000/vote/${pollId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              http://localhost:3000/vote/{pollId}
            </a>
          </Typography>

          <Button onClick={handleCopy} variant="outlined" color="secondary">
            Copy Link
          </Button>

          <Button
            onClick={() => router.push("/")}
            variant="contained"
            color="primary"
          >
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
}
