"use client"; // if using App Router, remove if using Pages Router

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import toast from "react-hot-toast";
import { userStore } from "@/store/userStore";
import { UserStoreType } from "@/types/user.types";
import { useRouter } from "next/navigation";

function SignupPage() {
  const router = useRouter();

  const { Signup, isSigningUp, user, CheckUser } = userStore() as UserStoreType;

  useEffect(() => {
    CheckUser();
  }, [CheckUser]);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handlePasswordValidation = (
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fullName = form.fullName.value;
    const email = form.email.value;
    const confirmPassword = form.confirmPassword.value;
    const password = form.password.value;

    if (!handlePasswordValidation(password, confirmPassword)) {
      return;
    }

    const data = {
      fullname: fullName,
      email,
      password,
    };

    Signup(data);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            bgcolor: "#112330",
            boxShadow: "0px 0px 24px 2px rgba(91,207,177,0.63)",
            borderRadius: 3,
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ color: "white", fontWeight: "bold" }}
          >
            Sign Up
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              name="fullName"
              type="text"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                style: { color: "#ccc" },
              }}
              InputProps={{
                style: { color: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#5bcfb1" },
                  "&:hover fieldset": { borderColor: "#5bcfb1" },
                  "&.Mui-focused fieldset": { borderColor: "#5bcfb1" },
                },
              }}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#5bcfb1" },
                  "&:hover fieldset": { borderColor: "#5bcfb1" },
                  "&.Mui-focused fieldset": { borderColor: "#5bcfb1" },
                },
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#5bcfb1" },
                  "&:hover fieldset": { borderColor: "#5bcfb1" },
                  "&.Mui-focused fieldset": { borderColor: "#5bcfb1" },
                },
              }}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#5bcfb1" },
                  "&:hover fieldset": { borderColor: "#5bcfb1" },
                  "&.Mui-focused fieldset": { borderColor: "#5bcfb1" },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              disabled={isSigningUp}
              variant="contained"
              sx={{
                marginTop: 2,
                backgroundColor: "#5bcfb1",
                color: "#112330",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#4fbfa1" },
              }}
            >
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "#ccc", marginTop: 2 }}
          >
            Already have an account?{" "}
            <a href="/user/login" style={{ color: "#5bcfb1" }}>
              Login
            </a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default SignupPage;
