"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Phone, ArrowRight, Lock, User } from 'lucide-react';

// Mock user database - in a real app, this would come from an API/backend
const mockUsers = {
  '9876543210': { name: 'John Doe', email: 'john@example.com', type: 'professional' }
};

// Step tracking for multi-step login flow
type LoginStep = 'phone' | 'otp' | 'registration';

const Login = () => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  // Form schema for user registration
  const userFormSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Invalid email format.').optional().or(z.literal('')),
    userType: z.enum(['student', 'professional', 'other']),
  });

  // Form handler for registration
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      userType: 'student',
    },
  });

  // Handle phone number submission
  const handlePhoneSubmit = () => {
    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    // console.log("Phone number:", phoneNumber);
    
    // Check if user exists (in a real app, this would be an API call)
    const userExists = mockUsers[phoneNumber as keyof typeof mockUsers];
    setIsExistingUser(!!userExists);
    
    // // Generate and send OTP (simulated)
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${phoneNumber}`
    });
    
    setCurrentStep('otp');
  };

  // Handle OTP verification
  const handleOtpSubmit = () => {
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    // Verify OTP (in a real app, this would be verified with an API)
    if (otpValue === '123456') { // Simulated successful verification
      if (isExistingUser) {
        // Existing user - log them in directly
        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });
        router.push('/profile');
      } else {
        // New user - collect additional information
        setCurrentStep('registration');
      }
    } else {
      toast({
        title: "Invalid OTP",
        description: "The verification code you entered is incorrect",
        variant: "destructive"
      });
    }
  };

  // Handle registration form submission
  const onRegisterSubmit = (data: z.infer<typeof userFormSchema>) => {
    // In a real app, this would send the data to your backend
    console.log("Registration data:", { phone: phoneNumber, ...data });
    
    toast({
      title: "Registration Successful",
      description: "Your account has been created successfully!"
    });
    
    // Store user in local storage for session management
    localStorage.setItem('currentUser', JSON.stringify({
      phone: phoneNumber,
      name: data.fullName,
      email: data.email || '',
      type: data.userType,
      isProfileComplete: false
    }));
    
    router.push('/profile');
  };

  // Render appropriate step based on current state
  const renderStep = () => {
    switch (currentStep) {
      case 'phone':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Enter your phone number to start or continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className=" left-3 top-3 h-7 w-7 text-gray-400" />
                <div className="flex w-full">
                  <div className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0 border-input text-gray-500">
                    +91
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="rounded-l-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary-dark"
                onClick={handlePhoneSubmit}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );

      case 'otp':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Verify Your Number</CardTitle>
              <CardDescription className="text-center">
                {"We've sent a code to"} {phoneNumber}
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
                {"Didn't receive code?"} <Button variant="link" className="p-0 h-auto">Resend</Button>
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary-dark"
                onClick={handleOtpSubmit}
              >
                Verify & Continue
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setCurrentStep('phone')}
              >
                Change Number
              </Button>
            </CardFooter>
          </>
        );

      case 'registration':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
              <CardDescription className="text-center">
                We need a few more details to set up your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input className="pl-10" placeholder="Your name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am a</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="professional">Working Professional</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary-dark mt-6"
                  >
                    Complete Registration
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[250px] w-[250px] rounded-full bg-secondary-light/20 blur-[100px]" />
      </div>
      
      <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        {renderStep()}
      </Card>
    </div>
  );
};

export default Login;