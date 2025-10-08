"use client";
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  PencilLine,
  User,
  ImagePlus,
  Briefcase,
  Star,
  Award,
  MapPin,
  DollarSign,
  Plus,
  X,
  Clock,
  GraduationCap,
  Link as LinkIcon,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import ProfileProgressBar from "@/components/ProfileProgressBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MeetingForm from "@/components/meetings/MeetingForm";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

const mentorProfileSchema = z.object({
  // fullName: z
  //   .string()
  //   .min(2, { message: "Name must be at least 2 characters." }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  isMentorVerified: z.boolean().optional(),
  location: z.string().optional(),
  price: z.string().optional(),
  availability: z.string().optional(),
  about: z.string().optional(),
  socialLinks: z.array(z.string()).optional(),
  educationalDetails: z
    .array(
      z.object({
        collegeName: z.string(),
        degreeName: z.string(),
      })
    )
    .optional(),
  workExperience: z
    .array(
      z.object({
        companyName: z.string(),
        role: z.string(),
        experience: z.string(),
      })
    )
    .optional(),
  skills: z.array(z.string()).optional(),
  fields: z.array(z.string()).optional(),
});

type MentorProfileValues = z.infer<typeof mentorProfileSchema>;

interface MentorProfileProps {
  username: string;
  isOwnProfile: boolean;
  initialData?: Partial<MentorProfileValues>;
}

export default function MentorProfile({
  username,
  isOwnProfile,
  initialData,
}: MentorProfileProps) {
  const [profileCompletion, setProfileCompletion] = useState(20);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const isLoggedIn = status === "authenticated";

  const defaultValues: Partial<MentorProfileValues> = {
    // fullName: initialData?.fullName || "",
    firstname: initialData?.firstname || "",
    lastname: initialData?.lastname || "",
    isMentorVerified: initialData?.isMentorVerified || false,
    about: initialData?.about || "",
    location: initialData?.location || "",
    price: initialData?.price || "",
    availability: initialData?.availability || "",
    socialLinks: initialData?.socialLinks || [],
    educationalDetails: initialData?.educationalDetails || [],
    workExperience: initialData?.workExperience || [],
    skills: initialData?.skills || [],
    fields: initialData?.fields || [],
  };

  const form = useForm<MentorProfileValues>({
    resolver: zodResolver(mentorProfileSchema),
    defaultValues,
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "educationalDetails",
  });

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const [skillInput, setSkillInput] = useState("");
  const [fieldInput, setFieldInput] = useState("");
  const [socialLinkInput, setSocialLinkInput] = useState("");

  const calculateProfileCompletion = useCallback(
    (values: Partial<MentorProfileValues>) => {
      let score = 20;
      if (profileImage) score += 10;
      if (values.firstname) score += 10;
      if (values.about) score += 10;
      if (values.location) score += 5;
      if (values.price) score += 5;
      if (values.availability) score += 5;
      if ((values.educationalDetails?.length || 0) > 0) score += 10;
      if ((values.workExperience?.length || 0) > 0) score += 10;
      if ((values.skills?.length || 0) > 0) score += 10;
      if ((values.fields?.length || 0) > 0) score += 5;
      setProfileCompletion(Math.min(100, score));
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
        fields: value.fields?.filter((f): f is string => f !== undefined),
        socialLinks: value.socialLinks?.filter((l): l is string => l !== undefined),
        skills: value.skills?.filter((s): s is string => s !== undefined),
        educationalDetails: value.educationalDetails?.filter((e): e is { collegeName: string; degreeName: string } => e !== undefined),
        workExperience: value.workExperience?.filter((w): w is { companyName: string; role: string; experience: string } => w !== undefined),
      };
      calculateProfileCompletion(cleanedValue);
    });
    return () => subscription.unsubscribe();
  }, [form, calculateProfileCompletion]);

  const onSubmit = async (data: MentorProfileValues) => {
    await updateProfile(data);
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

  const handleBookMeeting = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsDialogOpen(true);
  };

  const handleMeetingSubmit = () => {
    // console.log('Meeting scheduled with:', username, meetingData);
    setIsDialogOpen(false);
  };

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

  const addField = () => {
    if (fieldInput.trim()) {
      const currentFields = form.getValues().fields || [];
      form.setValue("fields", [...currentFields, fieldInput.trim()]);
      setFieldInput("");
    }
  };

  const removeField = (index: number) => {
    const currentFields = form.getValues().fields || [];
    form.setValue(
      "fields",
      currentFields.filter((_, i) => i !== index)
    );
  };

  const addSocialLink = () => {
    if (socialLinkInput.trim()) {
      const currentLinks = form.getValues().socialLinks || [];
      form.setValue("socialLinks", [...currentLinks, socialLinkInput.trim()]);
      setSocialLinkInput("");
    }
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = form.getValues().socialLinks || [];
    form.setValue(
      "socialLinks",
      currentLinks.filter((_, i) => i !== index)
    );
  };


  const updateProfile = async (reqdata: MentorProfileValues) => {
    
    try {
      setIsUpdating(true);

      const resuser = await axios.put("/api/updateuser", {
        firstName: reqdata.firstname,
        lastName: reqdata.lastname,
        about: reqdata.about,
      });

      const resmentor = await axios.put("/api/manage-mentor", {
        socialLinks: reqdata.socialLinks,
        educationalDetails: reqdata.educationalDetails,
        workExperience: reqdata.workExperience,
        skills: reqdata.skills,
        fields: reqdata.fields,
        location: reqdata.location,
        availability: reqdata.availability,
        price: reqdata.price,
      });

      if (resuser.data.success && resmentor.data.success) {
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
    <main className="flex-grow">
      <div className="relative py-16">
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

                <div className="flex-grow w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex-grow">
                      <h1 className="text-2xl md:text-3xl font-bold text-grey-800">
                        {form.getValues().firstname + " " + form.getValues().lastname || username}
                      </h1>
                      <div className="flex items-center gap-2 text-grey-600 mt-1">
                        {form.getValues().isMentorVerified ? (
                          <BadgeCheck
                            size={18}
                            className="text-primary-dark "
                          />
                        ) : (
                          <Star
                            size={16}
                            className="text-red-500 fill-red-500"
                          />
                        )}
                        <span className="font-medium">
                          {form.getValues().isMentorVerified
                            ? "Verified Mentor"
                            : "Not Verified"}
                        </span>
                      </div>

                      {form.getValues().location && (
                        <div className="flex items-center gap-2 text-grey-600 mt-2">
                          <MapPin size={16} />
                          <span>{form.getValues().location}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {form.getValues().price && (
                          <div className="flex items-center gap-2 text-grey-700 mt-2 font-semibold">
                            <DollarSign size={16} className="text-green-600" />
                            <span>{form.getValues().price}/session</span>
                          </div>
                        )}

                        {form.getValues().availability && (
                          <div className="flex items-center gap-0 text-grey-600 mt-2">
                            <Clock size={16} />
                            <span>{form.getValues().availability}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isOwnProfile && !isEditing && (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                        >
                          <PencilLine className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                      )}
                      {!isOwnProfile && (
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              onClick={handleBookMeeting}
                              className="bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/20 transition-all"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {isLoggedIn
                                ? "Book Meeting"
                                : "Login to Book Meeting"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border border-white/20">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-semibold text-grey-800">
                                Book a Meeting with{" "}
                                {form.getValues().firstname + " " + form.getValues().lastname || username}
                              </DialogTitle>
                              <DialogDescription className="text-grey-600">
                                Schedule a mentoring session. Fill in the
                                details below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <MeetingForm
                                onSubmit={handleMeetingSubmit}
                                submitLabel="Book Meeting"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>

                  {isOwnProfile && (
                    <ProfileProgressBar completion={profileCompletion} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* About Section - Display Mode */}
              {!isEditing && form.getValues().about && (
                <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                      <User size={20} />
                      About
                    </h2>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-grey-700 leading-relaxed whitespace-pre-wrap">
                      {form.getValues().about}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Basic Info - Edit Mode */}
              {isEditing && (
                <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                      <User size={20} />
                      Basic Information
                    </h2>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
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
                              <Input placeholder="City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Price ($)</FormLabel>
                            <FormControl>
                              <Input placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Availability</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Weekdays 9AM-5PM EST"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Me</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your professional journey and mentoring philosophy..."
                              className="resize-none min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Work Experience */}
              <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                      <Briefcase size={20} />
                      Work Experience
                    </h2>
                    {isEditing && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          appendWork({
                            companyName: "",
                            role: "",
                            experience: "",
                          })
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {workFields.length === 0 && !isEditing ? (
                    <p className="text-grey-500 text-center py-4">
                      No work experience added yet
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {workFields.map((field, index) => (
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
                                  Experience #{index + 1}
                                </h3>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeWork(index)}
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              <FormField
                                control={form.control}
                                name={`workExperience.${index}.role`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Senior Software Engineer"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`workExperience.${index}.companyName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Tech Corp"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`workExperience.${index}.experience`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Duration/Details</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="2020-2023 | 3 years"
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
                                {form.watch(`workExperience.${index}.role`)}
                              </h3>
                              <p className="text-grey-600 font-medium mt-1">
                                {form.watch(
                                  `workExperience.${index}.companyName`
                                )}
                              </p>
                              <p className="text-grey-500 text-sm mt-1">
                                {form.watch(
                                  `workExperience.${index}.experience`
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
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
                                name={`educationalDetails.${index}.degreeName`}
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
                                name={`educationalDetails.${index}.collegeName`}
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
                                {form.watch(
                                  `educationalDetails.${index}.degreeName`
                                )}
                              </h3>
                              <p className="text-grey-600 mt-1">
                                {form.watch(
                                  `educationalDetails.${index}.collegeName`
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                  <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                    <Star size={20} />
                    Skills
                  </h2>
                </CardHeader>
                <CardContent className="pt-6">
                  {isEditing && (
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Add a skill (e.g., React, Node.js)"
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

              {/* Fields/Specializations */}
              <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                  <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                    <Award size={20} />
                    Fields & Specializations
                  </h2>
                </CardHeader>
                <CardContent className="pt-6">
                  {isEditing && (
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Add a field (e.g., Web Development)"
                        value={fieldInput}
                        onChange={(e) => setFieldInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addField())
                        }
                      />
                      <Button type="button" onClick={addField}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(form.watch("fields") || []).length === 0 ? (
                      <p className="text-grey-500 text-center w-full py-2">
                        No fields added yet
                      </p>
                    ) : (
                      (form.watch("fields") || []).map((field, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1 text-sm border-primary text-primary"
                        >
                          {field}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeField(index)}
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

              {/* Social Links */}
              {(isEditing || (form.watch("socialLinks") || []).length > 0) && (
                <Card className="border border-grey-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <h2 className="text-xl font-semibold text-grey-800 flex items-center gap-2">
                      <LinkIcon size={20} />
                      Social Links
                    </h2>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isEditing && (
                      <div className="flex gap-2 mb-4">
                        <Input
                          placeholder="Add a social link URL"
                          value={socialLinkInput}
                          onChange={(e) => setSocialLinkInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addSocialLink())
                          }
                        />
                        <Button type="button" onClick={addSocialLink}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="space-y-2">
                      {(form.watch("socialLinks") || []).length === 0 ? (
                        <p className="text-grey-500 text-center py-2">
                          No social links added yet
                        </p>
                      ) : (
                        (form.watch("socialLinks") || []).map((link, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-grey-50 rounded"
                          >
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate"
                            >
                              {link}
                            </a>
                            {isEditing && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSocialLink(index)}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

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
