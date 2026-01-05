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
        callbackUrl: "/seller",
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
      window.location.href = "/seller";
    },
    [mutation]
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
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="flex flex-col w-full max-w-md px-8 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg transform rotate-6">
            <svg
              className="w-8 h-8 text-white transform -rotate-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-gray-900 font-bold text-2xl mb-1">Sign In</h1>
        <p className="text-sm font-normal text-gray-500 mb-8">
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
                  color: "#374151",
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
                    backgroundColor: "#f3f4f6",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#e5e7eb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#d1d5db",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#9ca3af",
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
                  color: "#374151",
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
                    backgroundColor: "#f3f4f6",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#e5e7eb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#d1d5db",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#9ca3af",
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
            className="block w-full bg-[#3b82f6] hover:bg-[#2563eb] active:bg-[#1d4ed8] mt-3 py-3 px-5 rounded-lg text-white font-semibold shadow-md transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/seller-auth/sign-up"
            className="text-gray-900 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerSignIn;
