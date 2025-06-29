"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Link } from "@mui/material";
import { useRouter } from "next/navigation";

type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>();

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", result.userId);
        router.push("/");
      } else {
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4"
      >
        <TextField
          label="Name"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <TextField
          label="Email"
          type="email"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
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
          {isSubmitting ? "Signing up..." : "Sign Up"}
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
