"use client";

import { FormControl } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { api } from "@/libs/api";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

type FormValues = {
  email: string;
  password: string;
};

const Register = () => {
  const router = useRouter();

  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: () => {
      return api(`/api/register`, {
        method: "POST",
        body: {
          email: formValues.email,
          password: formValues.password,
        },
      });
    },
    onSuccess: () => {
      router.push("/auth/login");
    },
  });

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (mutation.isPending) return;
      mutation.mutate();
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
    <div className="h-screen flex">
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white">
        <div className="flex flex-col px-5 md:px-48 w-full bg-white">
          <h1 className="text-gray-800 font-bold text-3xl mb-1 text-center md:text-left">
            Join Us Today!
          </h1>
          <p className="text-sm font-normal text-gray-600 mb-7 text-center md:text-left">
            Sign up now to unlock exclusive rewards and enjoy seamless access to
            our loyalty program.
          </p>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            <FormControl>
              <div className="flex flex-col gap-2">
                <FormLabel htmlFor="email" sx={{ fontWeight: "bold" }}>
                  Email
                </FormLabel>
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  size="small"
                  variant="outlined"
                  onChange={handleInputChange}
                />
              </div>
            </FormControl>
            <FormControl>
              <div className="flex flex-col gap-2">
                <FormLabel htmlFor="password" sx={{ fontWeight: "bold" }}>
                  Password
                </FormLabel>
                <TextField
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
                  onChange={handleInputChange}
                />
              </div>
            </FormControl>

            <button
              type="submit"
              className="block w-full bg-[#FF8901] hover:bg-[#fbbf7a] mt-5 py-2.5 px-5 rounded-lg text-white font-semibold mb-2 shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-5 text-sm font-bold">
            Already have an account?{" "}
            <Link href={"/auth/login"} className="text-[#FF8901]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center">
        <div className="relative w-full h-full">
          <Image
            src="/images/phone.jpg"
            alt="Picture of loyalty"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
