"use client";
import React from "react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import UserAdd from "@/components/icons/UserAdd";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpSchema, signUpSchema } from "../../../schema/auth";
import Loader from "@/components/Loader";
import { useSignup } from "@/hooks/useSignup";

const Signup = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };
  // Login form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: yupResolver(signUpSchema),
  });
  const { mutate, isPending } = useSignup();
  const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
    mutate(data);
    console.log(data);
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign Up</h1>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button onClick={handleGoogleLogin} className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                  <div className="bg-white p-2 rounded-full">
                    <GoogleIcon />
                  </div>
                  <span className="ml-4">Sign Up with Google</span>
                </button>
              </div>

              <div className="my-8 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign up with email
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto max-w-xs"
              >
                <div>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="name"
                    placeholder="Full Name"
                    id="fullName"
                    {...register("fullName")}
                  />
                  <p className="text-[#DC362E] text-sm px-8 py-1">
                    {errors.fullName?.message}
                  </p>
                </div>
                <div>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-3"
                    type="email"
                    placeholder="Email"
                    id="email"
                    {...register("email")}
                  />
                  <p className="text-[#DC362E] text-sm px-8 py-1">
                    {errors.email?.message}
                  </p>
                </div>
                <div className="mt-3">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                    type="password"
                    placeholder="Password"
                    id="password"
                    {...register("password")}
                  />
                  <p className="text-[#DC362E] text-sm px-8 py-1">
                    {errors.password?.message}
                  </p>
                </div>

                <button
                  disabled={isPending}
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  {isPending ? (
                    <div>
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <UserAdd />
                      <span className="ml-3">Sign Up</span>
                    </>
                  )}
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Have an account?{" "}
                  <a
                    href="/auth/login"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Login
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
