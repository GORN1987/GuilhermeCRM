

"use client";

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import TokenContext from "../contexts/token-context";
import { GoogleLogin } from "@react-oauth/google";
import { UserSubscriptionModal } from "../components/user-record-modal";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    axios
      .post(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        user: email,
        password: password,
      })
      .then((response: any) => {
        navigate("/HomePage");
        console.log(response);
      })
      .catch(() => {
        setError("Invalid Login");
      });

    // Here you would typically handle the login logic
    console.log("Login submitted", { email, password, rememberMe, subscribe });
  };

  const responseMessage = (response: any) => {
    console.log(response);
    axios
      .post(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        token: response.credential,
      })
      .then((response: any) => {
        navigate("/HomePage");
      });
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login {token}</CardTitle>
          <CardDescription>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            <UserSubscriptionModal />
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
