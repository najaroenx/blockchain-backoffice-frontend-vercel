"use client";

import { FormControl } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { api } from "@/libs/api";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SellerSignUp = () => {
  const router = useRouter();

  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string>("");

  const mutation = useMutation({
    mutationFn: () => {
      return api(`/api/seller/register`, {
        method: "POST",
        body: {
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
        },
      });
    },
    onSuccess: () => {
      router.push("/dlt/sign-in");
    },
  });

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Validate passwords match
      if (formValues.password !== formValues.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      setPasswordError("");

      if (mutation.isPending) return;
      mutation.mutate();
    },
    [mutation, formValues]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [event.target.name]: event.target.value,
      });
      // Clear password error when user starts typing
      if (
        event.target.name === "password" ||
        event.target.name === "confirmPassword"
      ) {
        setPasswordError("");
      }
    },
    [formValues]
  );

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: "8px",
      color: "#fff",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.1)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255,255,255,0.2)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#a855f7",
      },
    },
    "& .MuiInputBase-input": {
      padding: "12px 14px",
      color: "#fff",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#6b7280",
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0a0a1a]">
      <div className="flex flex-col w-full max-w-md px-8 py-12 bg-[#1a1a2e] rounded-2xl border border-white/10 mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/dlt" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">DLT</span>
              <span className="text-purple-400">chain</span>
            </span>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-white font-bold text-2xl mb-1 text-center">
          Sign Up
        </h1>
        <p className="text-sm font-normal text-gray-400 mb-8 text-center">
          And lets get started with your free trial
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
          {/* Username */}
          <FormControl>
            <div className="flex flex-col gap-1.5">
              <FormLabel
                htmlFor="username"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                }}
              >
                User name
              </FormLabel>
              <TextField
                id="username"
                type="text"
                name="username"
                placeholder="User Name"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                size="small"
                variant="outlined"
                value={formValues.username}
                onChange={handleInputChange}
                sx={inputSx}
              />
            </div>
          </FormControl>

          {/* Email */}
          <FormControl>
            <div className="flex flex-col gap-1.5">
              <FormLabel
                htmlFor="email"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                }}
              >
                Email
              </FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
                fullWidth
                size="small"
                variant="outlined"
                value={formValues.email}
                onChange={handleInputChange}
                sx={inputSx}
              />
            </div>
          </FormControl>

          {/* Password */}
          <FormControl>
            <div className="flex flex-col gap-1.5">
              <FormLabel
                htmlFor="password"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                }}
              >
                Password
              </FormLabel>
              <TextField
                name="password"
                placeholder="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
                size="small"
                value={formValues.password}
                onChange={handleInputChange}
                sx={inputSx}
              />
            </div>
          </FormControl>

          {/* Confirm Password */}
          <FormControl error={!!passwordError}>
            <div className="flex flex-col gap-1.5">
              <FormLabel
                htmlFor="confirmPassword"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                }}
              >
                Confirm Password
              </FormLabel>
              <TextField
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
                size="small"
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                error={!!passwordError}
                helperText={passwordError}
                sx={{
                  ...inputSx,
                  "& .MuiOutlinedInput-root": {
                    ...inputSx["& .MuiOutlinedInput-root"],
                    "& fieldset": {
                      borderColor: passwordError
                        ? "#ef4444"
                        : "rgba(255,255,255,0.1)",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#ef4444",
                  },
                }}
              />
            </div>
          </FormControl>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-3 py-3 px-5 rounded-lg text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            href="/dlt/sign-in"
            className="text-purple-400 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* Back to Home */}
        <Link
          href="/dlt"
          className="mt-4 text-sm text-center text-gray-500 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SellerSignUp;
