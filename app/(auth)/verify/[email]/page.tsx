"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  // FormControl,
  FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function VerifyAccount() {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ email: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/otpverification", {
        email: params.email,
        code: data.code,
      });
      toast(res.data?.message ?? "Some thing went wrong");
      router.replace("/login");
    } catch (error) {
      console.error("Error occured in form submitting", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Sign up fail => " + axiosError.response?.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Verify Your Number
              </CardTitle>
              <CardDescription className="text-center">
                {"We've"} sent a code to {decodeURIComponent(params.email)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <div className="flex justify-center">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      // value={otpValue}
                      // onChange={setOtpValue}
                      {...field}
                    >
                      <InputOTPGroup  >
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
              </div>
              {/* <p className="text-center text-sm text-muted-foreground mt-2">
                {"Didn't"} receive code?{" "}
                <Button variant="link" className="p-0 h-auto">
                  Resend
                </Button>
              </p> */}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-dark"
                 disabled={isSubmitting}
                // onClick={onSubmit}
              >
                {isSubmitting ? "Verifying..." : "Verify & Continue"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default VerifyAccount;
