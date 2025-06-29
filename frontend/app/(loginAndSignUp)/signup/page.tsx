"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Link } from "@mui/material";
// import { signup, SignupFormInputs } from "@/app/componeNts/signup";

export default function SignupPage() {
  type SignupFormInputs = {
    name: string;
    email: string;
    password: string;
  };
  const { register, handleSubmit } = useForm<SignupFormInputs>();
  const rere = async (data: SignupFormInputs) => {
    console.log("Submitting signup data:", data);

    try {
      const response = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Signup response:", result);

      if (response.ok) {
        console.log("Signup successful!", result);
        localStorage.setItem("userId", result.userId);
        window.location.href = "/"; // Adjust as needed
      } else {
        console.error("Signup failed:", result.message);
        alert(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error, please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Typography variant="h4" className="mb-6 font-bold text-white">
        Sign Up
      </Typography>

      <form onSubmit={handleSubmit(rere)} className="w-full max-w-sm space-y-4">
        <TextField
          label="Name"
          {...register("name", { required: true })}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <TextField
          label="Email"
          type="email"
          {...register("email", { required: true })}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
      </form>

      <Typography className="mt-4 text-white">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 underline">
          Login
        </Link>
      </Typography>
    </div>
  );
}
