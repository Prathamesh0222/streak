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
import { Eye } from "lucide-react";

export const Auth = ({ isSignIn }: { isSignIn: boolean }) => {
  const [showPassword, setShowPassword] = useState(false);
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
    try {
      if (!isSignIn) {
        const response = await axios.post(`/api/register`, values);
        if (response.data) {
          const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: true,
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
          redirect: true,
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
    }
  };

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div className="p-8 border rounded-xl shadow-xl">
          <div className="text-center mb-3">
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
              className="space-y-4 w-[350px]"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="***********"
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
              <Button type="submit" className="w-full">
                Submit
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
            className="w-full flex items-center justify-center gap-2"
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
                Register
              </Link>
            </div>
          ) : (
            <div className="text-sm text-center flex justify-center mt-3 gap-1">
              <p className="text-muted-foreground">Already have an Account?</p>
              <Link className="hover:underline font-semibold" href={"/signin"}>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
