"use client";

import {
  SignInInput,
  signInSchema,
  SignUpInput,
  signUpSchema,
} from "@/lib/validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { GoogleIcon } from "@/app/icons/GoogleIcon";
import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";

export const Auth = ({ isSignIn }: { isSignIn: boolean }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SignInInput | SignUpInput>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
    defaultValues: {
      ...(isSignIn ? {} : { name: "" }),
      email: "",
      password: "",
    },
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: SignInInput | SignUpInput) => {
    setIsLoading(true);
    try {
      if (!isSignIn) {
        const response = await axios.post(`/api/register`, values);
        if (response.data) {
          const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/dashboard",
          });

          if (result?.error) {
            toast.error("Failed to sign in after registration");
            return;
          }
          toast.success("User registered successfully");
        }
      } else {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: "/dashboard",
        });

        if (result?.error) {
          toast.error("Invalid email or password");
          return;
        }
        toast.success("Signed in successfully");
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div className="p-8 rounded-xl space-y-5">
          <div className="text-center mb-5">
            <h1 className="text-xl font-semibold">
              {isSignIn ? "Login" : "Register"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignIn
                ? "Enter your credentials"
                : "Fill the details to create account"}
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-[450px]"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold mb-1">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-xl py-5"
                          placeholder="John Doe"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold mb-1">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl py-5"
                        placeholder="john@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold mb-1">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="rounded-xl py-5"
                          type={showPassword ? "text" : "password"}
                          placeholder="***********"
                          disabled={isLoading}
                          {...field}
                        />
                        <Eye
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={handleShowPassword}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      {!isSignIn &&
                        "Password must be at least 8 characters with uppercase, lowercase, and numbers"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full rounded-xl py-5 cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isSignIn ? "Signing In..." : "Creating Account..."}
                  </>
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="relative">
            <div className="w-full h-px bg-border my-6" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
              OR
            </div>
          </div>
          <Button
            variant={"outline"}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-5 cursor-pointer font-semibold"
            onClick={() => signIn("google")}
          >
            <GoogleIcon /> Continue with Google
          </Button>
          {isSignIn ? (
            <div className="text-sm text-center flex justify-center mt-3 gap-1">
              <p className="text-muted-foreground">
                Don&apos;t have an Account?
              </p>
              <Link className="hover:underline font-semibold" href={"/signup"}>
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="text-sm text-center flex justify-center mt-3 gap-1">
              <p className="text-muted-foreground">Already have an Account?</p>
              <Link className="hover:underline font-semibold" href={"/signin"}>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
