"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { publicEnv } from "@/lib/env/public";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AuthInput from "./AuthInput";

function AuthForm() {
  const [schoolID, setSchoolID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: sign in logic
    signIn("credentials", {
      schoolID,
      username,
      name,
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/mainPage`,
    });
  };
  return (
    <Card className="min-w-[300px]">
      <CardHeader>
        <CardTitle>Sign {isSignUp ? "Up" : "In"}</CardTitle>
      </CardHeader>
      <CardContent className=" flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <AuthInput
            label="School ID"
            type="text"
            value={schoolID}
            setValue={setSchoolID}
          />
          {isSignUp && (
            <AuthInput
              label="Name"
              type="text"
              value={name}
              setValue={setName}
            />
          )}
          {isSignUp && (
            <AuthInput
              label="Phone"
              type="text"
              value={phone}
              setValue={setPhone}
            />
          )}
          {isSignUp && (
            <AuthInput
              label="Username"
              type="text"
              value={username}
              setValue={setUsername}
            />
          )}
          <AuthInput
            label="Password"
            type="password"
            value={password}
            setValue={setPassword}
          />
          {isSignUp && (
            <AuthInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
            />
          )}

        
          <div className="text-sm text-gray-500">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <a
                  className="cursor-pointer hover:underline"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </a>
              </span>
            ) : (
              <span>
                Do not have an account?{" "}
                <a
                  className="cursor-pointer hover:underline"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </a>
              </span>
            )}
          </div>
        
        <div className="flex w-full items-center gap-1 py-2">
          <div className="h-[1px] grow border-t"></div>
          <p className="text-xs text-gray-400">or</p>
          <div className="h-[1px] grow border-t"></div>
        </div>

          <Button type="submit" className="w-full">
            Sign {isSignUp ? "Up" : "In"}
          </Button>
        </form>
        

      </CardContent>
    </Card>
  );
}

export default AuthForm;
