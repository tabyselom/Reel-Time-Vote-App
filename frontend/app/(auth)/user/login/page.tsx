"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

import { userStore } from "@/store/userStore";
import { UserStoreType } from "@/types/user.types";
import { useRouter } from "next/navigation";

function LoginPage() {
  const router = useRouter();
  const { isLoggingIn, Login, user, CheckUser } = userStore() as UserStoreType;

  // Run CheckUser on mount
  useEffect(() => {
    CheckUser();
  }, []);

  // Watch for user changes
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    const data = {
      email,
      password,
    };

    Login(data);
    router.push("/");
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
            Log In
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
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

            <Button
              type="submit"
              fullWidth
              disabled={isLoggingIn}
              variant="contained"
              sx={{
                marginTop: 2,
                backgroundColor: "#5bcfb1",
                color: "#112330",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#4fbfa1" },
              }}
            >
              {isLoggingIn ? "Logging In ..." : "Log In"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "#ccc", marginTop: 2 }}
          >
            Don&apos;t have an account?{" "}
            <a href="/user/signup" style={{ color: "#5bcfb1" }}>
              Sign Up
            </a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginPage;
