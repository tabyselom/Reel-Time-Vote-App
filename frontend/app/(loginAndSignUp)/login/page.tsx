"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Link } from "@mui/material";
import { Login, LoginFormInputs } from "@/app/componeNts/login";

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Typography variant="h4" className="mb-6 font-bold text-white">
        Login
      </Typography>

      <form
        onSubmit={handleSubmit(Login)}
        className="w-full max-w-sm space-y-4"
      >
        <TextField
          label="Email"
          {...register("email", { required: true })}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password", { required: true })}
          fullWidth
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>

      <Typography className="mt-9 text-white">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-400 underline">
          Sign Up
        </Link>
      </Typography>
    </div>
  );
}
