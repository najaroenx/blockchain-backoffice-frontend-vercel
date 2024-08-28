"use client";

import { FormControl } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { useLogin, useNotify } from "react-admin";
import React, { useState } from "react";

type FormValues = {
  email: string;
  password: string;
};

export const Login = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });

  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login({ email: formValues.email, password: formValues.password });
    } catch (error) {
      notify("Invalid email or password. Please try again.");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="h-screen flex">
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white">
        <div className="flex flex-col px-5 md:px-48 w-full bg-white">
          <h1 className="text-gray-800 font-bold text-3xl mb-1 text-center md:text-left">
            Welcome back !
          </h1>
          <p className="text-sm font-normal text-gray-600 mb-7 text-center md:text-left">
            Enter to get unlimited access to loyalty program
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
              className="block w-full bg-indigo-600 hover:bg-indigo-500 mt-5 py-2.5 px-5 rounded-lg text-white font-semibold mb-2 shadow-md"
            >
              Login
            </button>
          </form>

          <div className="flex w-full items-center gap-5 py-6 text-sm text-slate-600 mt-5">
            <div className="h-px w-full bg-slate-200"></div>
            <p className="text-center font-semibold text-gray-600">OR</p>
            <div className="h-px w-full bg-slate-200"></div>
          </div>

          <button className="flex justify-center items-center bg-white border border-gray-300 rounded-lg shadow-md mt-5 py-2.5 px-5 font-semibold text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <svg
              className="h-6 w-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="800px"
              height="800px"
              viewBox="-0.5 0 48 48"
              version="1.1"
            >
              <g
                id="Icons"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                {" "}
                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                  {" "}
                  <g id="Google" transform="translate(401.000000, 860.000000)">
                    {" "}
                    <path
                      d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                      id="Fill-1"
                      fill="#FBBC05"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                      id="Fill-2"
                      fill="#EB4335"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                      id="Fill-3"
                      fill="#34A853"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                      id="Fill-4"
                      fill="#4285F4"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            <span>Continue with Google</span>
          </button>
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
