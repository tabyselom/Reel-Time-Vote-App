"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography } from "@mui/material";

type PollFormInputs = {
  question: string;
  options: string;
};

export default function CreatePage() {
  const { register, handleSubmit } = useForm<PollFormInputs>();

  const onSubmit = async (data: PollFormInputs) => {
    console.log("Submitting poll data:", data);
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
      // Redirect or show success message
      // Adjust the redirect path as needed
    } else {
      const error = await res.json();
      console.error("Error creating poll:", error);
      alert(error.message || "Failed to create poll");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <Typography variant="h4" className="m-[30] font-bold">
        Create Poll
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <TextField
          label="Poll Question"
          {...register("question", { required: true })}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <TextField
          label="Options (comma separated)"
          {...register("options", { required: true })}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Poll
        </Button>
      </form>
    </div>
  );
}
