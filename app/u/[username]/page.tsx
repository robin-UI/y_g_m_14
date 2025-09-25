"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import StudentProfile from "@/components/profiles/StudentProfile";
import MentorProfile from "@/components/profiles/MentorProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, AlertCircle } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  fullName: string;
  userType: "student" | "mentor";
  bio?: string;
  education?: string;
  jobTitle?: string;
  company?: string;
  skills?: string;
  interests?: string;
  location?: string;
  experience?: string;
  mentoringAreas?: string;
  achievements?: string;
  learningGoals?: string;
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with actual API call to fetch user data by username
        // const response = await fetch(`/api/user/profile/${username}`);
        // if (!response.ok) {
        //   throw new Error('User not found');
        // }
        // const userData = await response.json();

        // Mock data for demonstration - Replace this with actual API call
        const mockUserData: UserData = {
          id: "mock-id",
          username: username,
          fullName: username === "john.doe" ? "John Doe" : "Jane Smith",
          userType: username === "john.doe" ? "student" : "mentor",
          bio: username === "john.doe"
            ? "Computer Science student passionate about web development and AI"
            : "Senior Software Engineer with 8+ years of experience in full-stack development",
          education: username === "john.doe"
            ? "Bachelor's in Computer Science at MIT (Class of 2025)"
            : "M.S. Computer Science, Stanford University",
          location: "San Francisco, CA",
          skills: username === "john.doe"
            ? "JavaScript, React, Python, Machine Learning"
            : "JavaScript, TypeScript, React, Node.js, AWS, System Design",
          interests: username === "john.doe"
            ? "Web Development, Artificial Intelligence, Open Source"
            : "Technology Leadership, Mentoring, Product Development",
          ...(username === "john.doe"
            ? { learningGoals: "Master full-stack development and land a software engineering internship" }
            : {
                jobTitle: "Senior Software Engineer",
                company: "Tech Innovations Inc.",
                experience: "8+ years in software development, led teams of 5-10 engineers",
                mentoringAreas: "Software Engineering, Career Development, Technical Leadership",
                achievements: "Led development of 3 major products, Mentor of the Year 2023"
              }
          )
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setUserData(mockUserData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

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
              {error || "The profile you're looking for doesn't exist or has been removed."}
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
  if (userData.userType === "student") {
    return (
      <StudentProfile
        username={userData.username}
        isOwnProfile={isOwnProfile}
        initialData={{
          fullName: userData.fullName,
          bio: userData.bio,
          education: userData.education,
          interests: userData.interests,
          skills: userData.skills,
          location: userData.location,
          learningGoals: userData.learningGoals,
        }}
      />
    );
  }

  if (userData.userType === "mentor") {
    return (
      <MentorProfile
        username={userData.username}
        isOwnProfile={isOwnProfile}
        initialData={{
          fullName: userData.fullName,
          bio: userData.bio,
          education: userData.education,
          jobTitle: userData.jobTitle,
          company: userData.company,
          skills: userData.skills,
          experience: userData.experience,
          mentoringAreas: userData.mentoringAreas,
          achievements: userData.achievements,
          location: userData.location,
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