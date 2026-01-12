"use client";

import { FormControl } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";

type FormValues = {
  email: string;
  password: string;
};

const SellerSignIn = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return await signIn("credentials", {
        redirect: true,
        callbackUrl: "/dlt/merchant",
        email: formValues.email,
        password: formValues.password,
      });
    },
  });

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      //   if (mutation.isPending) return;
      //   mutation.mutate();
      window.location.href = "/dlt/merchant";
    },
    []
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [event.target.name]: event.target.value,
      });
    },
    [formValues]
  );

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
          Sign In
        </h1>
        <p className="text-sm font-normal text-gray-400 mb-8 text-center">
          เข้าสู่ระบบผู้ขาย
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
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
                autoFocus
                required
                fullWidth
                size="small"
                variant="outlined"
                value={formValues.email}
                onChange={handleInputChange}
                sx={{
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
                }}
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
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                size="small"
                value={formValues.password}
                onChange={handleInputChange}
                sx={{
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
            {mutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-sm text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/dlt/sign-up"
            className="text-purple-400 font-semibold hover:underline"
          >
            Sign up
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

export default SellerSignIn;
