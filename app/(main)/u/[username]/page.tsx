"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import StudentProfile from "@/components/profiles/StudentProfile";
import MentorProfile from "@/components/profiles/MentorProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, AlertCircle } from "lucide-react";
import axios from "axios";

interface EducationalDetails {
  collegeName: string;
  degreeName: string;
}

interface WorkExperience {
  companyName: string;
  role: string;
  experience: string;
}

interface UserData {
  id: string;
  username: string;
  // fullName: string;
  firstname: string;
  lastname: string;
  userType: "STUDENT" | "MENTOR";
  about?: string;
  price?: string;
  isMentorVerified?: boolean;
  education?: EducationalDetails[];
  workExperience?: WorkExperience[];
  fields?: string[];
  company?: string;
  skills?: string[];
  interests?: string[];
  location?: string;
  experience?: string;
  availability?: string;
  achievements?: string;
  learningGoals?: string;
  socialLinks?: string[];
}

export default function PublicProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const username = params.username as string;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if this is the user's own profile
  const isOwnProfile = session?.user?.username === username;

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call to fetch user data by username
      const response = await axios(`/api/profile?username=${username}`);
      if (response.statusText !== "OK") {
        throw new Error("User not found");
      }
      const userData = response.data;

      let userStatData : UserData = {
        id: userData.data._id,
        username: userData.data.username,
        userType: userData.data.role === "MENTOR" ? "MENTOR" : "STUDENT",
        // fullName: userData.data.firstName + " " + userData.data.lastName,
        firstname: userData.data.firstName,
        lastname: userData.data.lastName,
        about: userData.data.about,
      }

      if (userData.data.role === "MENTOR" && userData.data.details) {
        userStatData = {
          ...userStatData,
          education: userData.data.details.educationalDetails,
          workExperience: userData.data.details.workExperience,
          skills: userData.data.details.skills,
          fields: userData.data.details.fields,
          location: userData.data.details.location,
          isMentorVerified: userData.data.details.isMentorVerified,
          socialLinks: userData.data.details.socialLinks,
          price: userData.data.details.price ? userData.data.details.price.toString() : undefined,
          availability: userData.data.details.availability,
        };
      }

      if (userData.data.role === "MENTOR" && userData.data.details) {
        userStatData = {
          ...userStatData,
          education: userData.data.details.educationalDetails,
          interests: userData.data.details.interested,
          skills: userData.data.details.skills,
        }
      }

      setUserData({...userStatData});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username, fetchUserData]);

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-grey-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (error || !userData) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-grey-600 mb-4">
              {error ||
                "The profile you're looking for doesn't exist or has been removed."}
            </p>
            <p className="text-sm text-grey-500">
              Username: <span className="font-mono">{username}</span>
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Render appropriate profile component based on user type
  if (userData.userType === "STUDENT") {
    return (
      <StudentProfile
        username={userData.username}
        isOwnProfile={isOwnProfile}
        initialData={{
          // fullName: userData.fullName,
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          about: userData.about,

          education: userData.education,
          interests: userData.interests,
          skills: userData.skills,
          // location: userData.location,
          // learningGoals: userData.learningGoals,
        }}
      />
    );
  }

  if (userData.userType === "MENTOR") {
    return (
      <MentorProfile
        username={userData.username}
        isOwnProfile={isOwnProfile}
        initialData={{
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          about: userData.about,
          location: userData.location,
          price: userData.price,
          availability: userData.availability,
          socialLinks: userData.socialLinks,
          educationalDetails: userData.education || [],
          workExperience: userData.workExperience,
          skills: userData.skills,
          fields: userData.fields,
          isMentorVerified: userData.isMentorVerified || false,
        }}
      />
    );
  }

  // Fallback for unknown user types
  return (
    <main className="flex-grow flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 text-center">
          <User className="mx-auto h-12 w-12 text-grey-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Invalid Profile Type</h2>
          <p className="text-grey-600">
            This profile has an unsupported user type.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
