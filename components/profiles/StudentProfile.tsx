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
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import {
  PencilLine,
  User,
  ImagePlus,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Plus,
  X,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProfileProgressBar from "@/components/ProfileProgressBar";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

const studentProfileSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  about: z.string(),
  education: z
    .array(
      z.object({
        collegeName: z.string(),
        degreeName: z.string(),
      })
    )
    ,
  interests: z.array(z.string()),
  skills: z.array(z.string()),
});

type StudentProfileValues = z.infer<typeof studentProfileSchema>;

interface StudentProfileProps {
  username: string;
  isOwnProfile: boolean;
  initialData?: Partial<StudentProfileValues>;
}

export default function StudentProfile({
  username,
  isOwnProfile,
  initialData,
}: StudentProfileProps) {
  const [profileCompletion, setProfileCompletion] = useState(20);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const defaultValues: Partial<StudentProfileValues> = {
    firstname: initialData?.firstname || "",
    lastname: initialData?.lastname || "",
    about: initialData?.about || "",
    education: initialData?.education || [],
    interests: initialData?.interests || [],
    skills: initialData?.skills || [],
  };

  const form = useForm<StudentProfileValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues,
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
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
      // Filter out undefined values from arrays
      const cleanedValue = {
        ...value,
        interests: value.interests?.filter((i): i is string => i !== undefined),
        skills: value.skills?.filter((s): s is string => s !== undefined),
        education: value.education?.filter((e): e is { collegeName: string; degreeName: string } => e !== undefined),
      };
      calculateProfileCompletion(cleanedValue);
    });
    return () => subscription.unsubscribe();
  }, [form, profileImage, calculateProfileCompletion]);

  const onSubmit = async (data: StudentProfileValues) => {
    await updateprofile(data);
    console.log(data);
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
    basic: profileImage && form.getValues().firstname ? 100 : 50,
    education: form.getValues().education && form.getValues().education.length > 0 ? 100 : 0,
    interests: form.getValues().interests && form.getValues().interests.length > 0 ? 100 : 0,
    skills: form.getValues().skills && form.getValues().skills.length > 0 ? 100 : 0,
  };

  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = form.getValues().skills || [];
      form.setValue("skills", [...currentSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues().skills || [];
    form.setValue(
      "skills",
      currentSkills.filter((_, i) => i !== index)
    );
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      const currentInterests = form.getValues().interests || [];
      form.setValue("interests", [...currentInterests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const removeInterest = (index: number) => {
    const currentInterests = form.getValues().interests || [];
    form.setValue(
      "interests",
      currentInterests.filter((_, i) => i !== index)
    );
  };

  const updateprofile = async (reqdata: StudentProfileValues) => {
    try {
      setIsUpdating(true);

      const resuser = await axios.put("/api/updateuser", {
        firstName: reqdata.firstname,
        lastName: reqdata.lastname,
        about: reqdata.about,
      });

      const resstudent = await axios.put("/api/manage-student", {
        educationalDetails: reqdata.education,
        interested: reqdata.interests,
        skills: reqdata.skills,
      });

      if (resuser.data.success && resstudent.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="flex-grow overflow-x-hidden">
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
                        {form.getValues().firstname +
                          " " +
                          form.getValues().lastname || username}
                      </h1>
                      <div className="flex items-center gap-2 text-grey-600">
                        <BookOpen size={16} />
                        <span>Student</span>
                      </div>
                      {form.getValues().about && (
                        <p className="text-grey-600 mt-2">
                          {form.getValues().about}
                        </p>
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

                  {isOwnProfile && (
                    <ProfileProgressBar completion={profileCompletion} />
                  )}
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
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your first name"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your last name"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="about"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About Me</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us a little about yourself and your learning journey..."
                                  className="resize-none min-h-[120px]"
                                  {...field}
                                  disabled={!isEditing}
                                />
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
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                        <GraduationCap size={20} />
                        Education
                      </h2>
                      {isEditing && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() =>
                            appendEducation({ collegeName: "", degreeName: "" })
                          }
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {educationFields.length === 0 && !isEditing ? (
                      <p className="text-grey-500 text-center py-4">
                        No education added yet
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {educationFields.map((field, index) => (
                          <div
                            key={field.id}
                            className={`${
                              isEditing
                                ? "border border-grey-200 rounded-lg p-4"
                                : "pb-6 border-b border-grey-200 last:border-0"
                            }`}
                          >
                            {isEditing ? (
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium text-grey-800">
                                    Education #{index + 1}
                                  </h3>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEducation(index)}
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`education.${index}.degreeName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Degree</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Bachelor of Science in Computer Science"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`education.${index}.collegeName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Institution</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="University Name"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-semibold text-grey-800 text-lg">
                                  {form.watch(`education.${index}.degreeName`)}
                                </h3>
                                <p className="text-grey-600 mt-1">
                                  {form.watch(`education.${index}.collegeName`)}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
                      {isEditing && (
                        <div className="flex gap-2 mb-4">
                          <Input
                            placeholder="Add a skill (e.g., React, Python)"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && (e.preventDefault(), addSkill())
                            }
                          />
                          <Button type="button" onClick={addSkill}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {(form.watch("skills") || []).length === 0 ? (
                          <p className="text-grey-500 text-center w-full py-2">
                            No skills added yet
                          </p>
                        ) : (
                          (form.watch("skills") || []).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1 text-sm"
                            >
                              {skill}
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => removeSkill(index)}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </Badge>
                          ))
                        )}
                      </div>
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
                      {isEditing && (
                        <div className="flex gap-2 mb-4">
                          <Input
                            placeholder="Add an interest (e.g., Web Development)"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && (e.preventDefault(), addInterest())
                            }
                          />
                          <Button type="button" onClick={addInterest}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {(form.watch("interests") || []).length === 0 ? (
                          <p className="text-grey-500 text-center w-full py-2">
                            No interests added yet
                          </p>
                        ) : (
                          (form.watch("interests") || []).map((interest, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="px-3 py-1 text-sm border-primary text-primary"
                            >
                              {interest}
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => removeInterest(index)}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </Badge>
                          ))
                        )}
                      </div>
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
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-md hover:shadow-primary/20"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
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
