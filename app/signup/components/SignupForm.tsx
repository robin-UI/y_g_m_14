"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
// import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import axios, { AxiosPromise } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface VerifyOTPResponse {
  email: string;
  otp: string;
}

async function postData(data: UserData): Promise<AxiosPromise> {
  return await axios.post("/api/signin", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function verifyOTPPost(data: VerifyOTPResponse): Promise<AxiosPromise> {
  return await axios.post("/api/otpverification", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

}

function SignupForm() {
  const [isLoged, setIsLoged] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  // const [phoneNumber, setPhoneNumber] = useState("+91 12345 67890");
  const { toast } = useToast();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // const { loading, error, sendOTP, verifyOTP, resendOTP, setError } =
  //   usePhoneAuth();

  // form validation and submission
  const validateForm = () => {
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.phone ||
      !userData.password ||
      !userData.confirmPassword
    ) {
      return false;
    }
    if (userData.password !== userData.confirmPassword) {
      return false;
    }
    // Add more validation as needed
    return true;
  };

  const userMutate = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      console.log("User data submitted successfully:", data);
      setIsLoged(!true); // Simulate successful login
    },
    onError: (error) => {
      console.error("Error submitting user data:", error);
    },
  });

  const verifyOTPMutate = useMutation({
    mutationFn: verifyOTPPost,
    onSuccess: (data) => {
      console.log("OTP verified successfully:", data);
      toast({
        title: "OTP Verified",
        description: "Your phone number has been verified.",
        variant: "destructive",
      });
    },
    onError: (error) => {
      console.error("Error verifying OTP:", error);
      toast({
        title: "OTP Verification Failed",
        description: "Please check your OTP and try again.",
        variant: "destructive",
      });
    },
  })

  // Handle OTP verification
  const handleVerifyOTP = async () => {

    if (!otpValue || otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    const otpData: VerifyOTPResponse = {
      email: userData.email,
      otp: otpValue,
    };

    verifyOTPMutate.mutate(otpData);

    // Firebase OTP verification 🔥🔥🔥
    // const result = await verifyOTP(otpValue);
    // if (result.success) {
    //   console.log("OTP verified successfully Robin");
    //   toast({
    //     title: "OTP Submited Successfully",
    //     description: `Your phone number ${userData.phone} has been verified.`,
    //     // variant: "success",
    //     variant: "destructive"
    //   });
    //   userMutate.mutate(userData);
    // }
  };

  //Firebase OTP sending 🔥🔥🔥
  // const handleOtpSubmit = async () => {
  //   setError(null);
  //   const result = await sendOTP(userData.phone);
  //   if (result.success) {
  //     toast({
  //       title: "OTP Sent",
  //       description: `A verification code has been sent to ${userData.phone}.`,
  //       // variant: "success",
  //     });
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission, e.g., send data to an API
    if (!validateForm()) {
      alert("Please fill in all fields correctly.");
      return;
    }
    console.log("User Data Submitted:", userData);
    setIsLoged(true); // Simulate successful login
    // handleOtpSubmit();
    userMutate.mutate(userData);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        {!isLoged ? (
          <CardContent>
            <form className="py-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Hello, new one </h1>
                  <p className="text-muted-foreground text-balance">
                    Create new account
                  </p>
                </div>
                <div className="flex md:flex-row flex-col gap-2 ">
                  <div className="w-full">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder=""
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      placeholder=""
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="phone"
                    placeholder="+91 12345 67890"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Your Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={togglePassword ? "text" : "password"}
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                      required
                    />
                    <Button
                      variant="ghost"
                      className="absolute right-0 top-1/2 -translate-y-1/2"
                      onClick={() => setTogglePassword(!togglePassword)}
                    >
                      {togglePassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                  {/* <Input id="password" type="password" value={userData.password} onChange={e => setUserData({ ...userData, password: e.target.value})} required /> */}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="cnfpassword">Conform Password</Label>
                  </div>
                  <Input
                    id="cnfpassword"
                    type={togglePassword ? "text" : "password"}
                    value={userData.confirmPassword}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Apple</span>
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Meta</span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Did you have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Verify Your Number
              </CardTitle>
              <CardDescription className="text-center">
                {"We've sent a code to"} {userData.phone}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {"Didn't receive code?"}{" "}
                <Button variant="link" className="p-0 h-auto">
                  Resend
                </Button>
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary-dark"
                onClick={handleVerifyOTP}
              >
                Verify & Continue
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsLoged(false)}
              >
                Change Number
              </Button>
            </CardFooter>
          </CardContent>
        )}
      </Card>
      <div id="recaptcha-container" className=""></div>
    </div>
  );
}

export default SignupForm;
