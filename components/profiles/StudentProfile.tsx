"use client";
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, PencilLine, User, ImagePlus, BookOpen, Target, Lightbulb } from "lucide-react";
import ProfileProgressBar from "@/components/ProfileProgressBar";

const studentProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().optional(),
  education: z.string().optional(),
  interests: z.string().optional(),
  skills: z.string().optional(),
  location: z.string().optional(),
  learningGoals: z.string().optional(),
});

type StudentProfileValues = z.infer<typeof studentProfileSchema>;

interface StudentProfileProps {
  username: string;
  isOwnProfile: boolean;
  initialData?: Partial<StudentProfileValues>;
}

export default function StudentProfile({ username, isOwnProfile, initialData }: StudentProfileProps) {
  const [profileCompletion, setProfileCompletion] = useState(20);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const defaultValues: Partial<StudentProfileValues> = {
    fullName: initialData?.fullName || "",
    bio: initialData?.bio || "",
    education: initialData?.education || "",
    interests: initialData?.interests || "",
    skills: initialData?.skills || "",
    location: initialData?.location || "",
    learningGoals: initialData?.learningGoals || "",
  };

  const form = useForm<StudentProfileValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues,
  });

  const calculateProfileCompletion = useCallback(
    (values: Partial<StudentProfileValues>) => {
      const totalFields = Object.keys(studentProfileSchema.shape).length;
      const filledFields = Object.entries(values).filter(
        ([, value]) => value && value.toString().trim() !== ""
      ).length;

      const imageBonus = profileImage ? 10 : 0;
      const percentage = Math.min(
        100,
        20 + Math.floor((filledFields / totalFields) * 70) + imageBonus
      );
      setProfileCompletion(percentage);
    },
    [profileImage]
  );

  useEffect(() => {
    calculateProfileCompletion(form.getValues());
  }, [calculateProfileCompletion, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      calculateProfileCompletion(value);
    });
    return () => subscription.unsubscribe();
  }, [form, profileImage]);

  const onSubmit = (data: StudentProfileValues) => {
    console.log("Student profile data submitted:", data);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sectionCompletion = {
    basic: profileImage && form.getValues().fullName ? 100 : 50,
    education: form.getValues().education ? 100 : 0,
    interests: form.getValues().interests ? 100 : 0,
    skills: form.getValues().skills ? 100 : 0,
    goals: form.getValues().learningGoals ? 100 : 0,
  };

  return (
    <main className="flex-grow">
      <div className="relative py-16">
        {/* Decorative blurred circles */}
        <div className="absolute -z-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl top-10 left-1/3 opacity-70"></div>
        <div className="absolute -z-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl bottom-20 right-20"></div>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-primary/40 p-1 bg-white/80 backdrop-blur-sm relative">
                    <Avatar className="h-28 w-28">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt="Profile picture" />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User size={48} />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isOwnProfile && (
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 bg-secondary text-white p-1.5 rounded-full cursor-pointer shadow-lg hover:bg-secondary/90 transition-all"
                      >
                        <ImagePlus size={16} />
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-grey-800">
                        {form.getValues().fullName || username}
                      </h1>
                      <div className="flex items-center gap-2 text-grey-600">
                        <BookOpen size={16} />
                        <span>Student</span>
                      </div>
                      {form.getValues().bio && (
                        <p className="text-grey-600 mt-2">{form.getValues().bio}</p>
                      )}
                    </div>

                    {isOwnProfile && !isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="mt-2 md:mt-0"
                      >
                        <PencilLine className="mr-2 h-4 w-4" /> Edit Profile
                      </Button>
                    )}
                  </div>

                  {isOwnProfile && <ProfileProgressBar completion={profileCompletion} />}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form/Display */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Basic Information */}
                <Card className="overflow-hidden border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                        <User size={20} />
                        Basic Information
                      </h2>
                      {isOwnProfile && (
                        <div className="flex items-center bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary">
                          <span>{sectionCompletion.basic}% Complete</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Your full name"
                                  {...field}
                                  className="pr-10"
                                  disabled={!isEditing}
                                />
                                {field.value && (
                                  <Check
                                    size={16}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="City, Country"
                                  {...field}
                                  className="pr-10"
                                  disabled={!isEditing}
                                />
                                {field.value && (
                                  <Check
                                    size={16}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Biography</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Textarea
                                    placeholder="Tell us a little about yourself and your learning journey..."
                                    className="resize-none min-h-[120px]"
                                    {...field}
                                    disabled={!isEditing}
                                  />
                                  {field.value && (
                                    <Check
                                      size={16}
                                      className="absolute right-3 top-3 text-green-500"
                                    />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                        <BookOpen size={20} />
                        Education
                      </h2>
                      {isOwnProfile && (
                        <div className="flex items-center bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary">
                          <span>{sectionCompletion.education}% Complete</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Background</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Your current studies, degree program, institution, year of study..."
                                className="resize-none min-h-[100px]"
                                {...field}
                                disabled={!isEditing}
                              />
                              {field.value && (
                                <Check
                                  size={16}
                                  className="absolute right-3 top-3 text-green-500"
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Learning Goals */}
                <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                        <Target size={20} />
                        Learning Goals
                      </h2>
                      {isOwnProfile && (
                        <div className="flex items-center bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary">
                          <span>{sectionCompletion.goals}% Complete</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="learningGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What do you want to learn?</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Describe your learning goals, what skills you want to develop, career aspirations..."
                                className="resize-none min-h-[100px]"
                                {...field}
                                disabled={!isEditing}
                              />
                              {field.value && (
                                <Check
                                  size={16}
                                  className="absolute right-3 top-3 text-green-500"
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Skills & Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Skills */}
                  <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                          <Lightbulb size={20} />
                          Skills
                        </h2>
                        {isOwnProfile && (
                          <div className="flex items-center bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary">
                            <span>{sectionCompletion.skills}% Complete</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Skills</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  placeholder="List your current skills and abilities (e.g., Python, Mathematics, Communication)"
                                  className="resize-none min-h-[100px]"
                                  {...field}
                                  disabled={!isEditing}
                                />
                                {field.value && (
                                  <Check
                                    size={16}
                                    className="absolute right-3 top-3 text-green-500"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Interests */}
                  <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                          <Target size={20} />
                          Interests
                        </h2>
                        {isOwnProfile && (
                          <div className="flex items-center bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary">
                            <span>{sectionCompletion.interests}% Complete</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Interests</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  placeholder="Share your interests and areas you're passionate about"
                                  className="resize-none min-h-[100px]"
                                  {...field}
                                  disabled={!isEditing}
                                />
                                {field.value && (
                                  <Check
                                    size={16}
                                    className="absolute right-3 top-3 text-green-500"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              {isOwnProfile && isEditing && (
                <div className="flex justify-end gap-4 pt-4 sticky bottom-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-md hover:shadow-primary/20"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}