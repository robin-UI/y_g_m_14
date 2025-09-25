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
import { Check, PencilLine, User, ImagePlus, Briefcase, Star, Award, Users } from "lucide-react";
import ProfileProgressBar from "@/components/ProfileProgressBar";

const mentorProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().optional(),
  education: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  mentoringAreas: z.string().optional(),
  achievements: z.string().optional(),
  location: z.string().optional(),
});

type MentorProfileValues = z.infer<typeof mentorProfileSchema>;

interface MentorProfileProps {
  username: string;
  isOwnProfile: boolean;
  initialData?: Partial<MentorProfileValues>;
}

export default function MentorProfile({ username, isOwnProfile, initialData }: MentorProfileProps) {
  const [profileCompletion, setProfileCompletion] = useState(20);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const defaultValues: Partial<MentorProfileValues> = {
    fullName: initialData?.fullName || "",
    bio: initialData?.bio || "",
    education: initialData?.education || "",
    jobTitle: initialData?.jobTitle || "",
    company: initialData?.company || "",
    skills: initialData?.skills || "",
    experience: initialData?.experience || "",
    mentoringAreas: initialData?.mentoringAreas || "",
    achievements: initialData?.achievements || "",
    location: initialData?.location || "",
  };

  const form = useForm<MentorProfileValues>({
    resolver: zodResolver(mentorProfileSchema),
    defaultValues,
  });

  const calculateProfileCompletion = useCallback(
    (values: Partial<MentorProfileValues>) => {
      const totalFields = Object.keys(mentorProfileSchema.shape).length;
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

  const onSubmit = (data: MentorProfileValues) => {
    console.log("Mentor profile data submitted:", data);
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
    work: form.getValues().jobTitle || form.getValues().company ? 100 : 0,
    skills: form.getValues().skills ? 100 : 0,
    mentoring: form.getValues().mentoringAreas ? 100 : 0,
    achievements: form.getValues().achievements ? 100 : 0,
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
                        <Star size={16} className="text-amber-500" />
                        <span>Mentor</span>
                      </div>
                      {form.getValues().jobTitle && form.getValues().company && (
                        <div className="flex items-center gap-2 text-grey-600 mt-1">
                          <Briefcase size={16} />
                          <span>{form.getValues().jobTitle} at {form.getValues().company}</span>
                        </div>
                      )}
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
                              <FormLabel>Professional Bio</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Textarea
                                    placeholder="Share your professional journey and mentoring philosophy..."
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

                {/* Professional Experience */}
                <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                        <Briefcase size={20} />
                        Professional Experience
                      </h2>
                      {isOwnProfile && (
                        <div className="flex items-center bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary">
                          <span>{sectionCompletion.work}% Complete</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Job Title</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Senior Software Engineer"
                                  {...field}
                                  disabled={!isEditing}
                                  className="pr-10"
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
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Tech Company Inc."
                                  {...field}
                                  disabled={!isEditing}
                                  className="pr-10"
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
                    </div>

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Experience</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Describe your professional journey, key roles, and experience..."
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

                {/* Education */}
                <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                        <Award size={20} />
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
                                placeholder="Your educational background, degrees, certifications..."
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

                {/* Mentoring Areas */}
                <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                        <Users size={20} />
                        Mentoring Areas
                      </h2>
                      {isOwnProfile && (
                        <div className="flex items-center bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary">
                          <span>{sectionCompletion.mentoring}% Complete</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="mentoringAreas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Areas of Mentoring</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="What areas can you mentor in? (e.g., Software Development, Career Guidance, Leadership, Entrepreneurship)"
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

                {/* Skills & Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Skills */}
                  <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                          <Star size={20} />
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
                            <FormLabel>Technical & Soft Skills</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  placeholder="List your key technical and soft skills (e.g., JavaScript, Leadership, Project Management)"
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

                  {/* Achievements */}
                  <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                          <Award size={20} />
                          Achievements
                        </h2>
                        {isOwnProfile && (
                          <div className="flex items-center bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary">
                            <span>{sectionCompletion.achievements}% Complete</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name="achievements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Achievements</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  placeholder="Share your notable achievements, awards, recognitions..."
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