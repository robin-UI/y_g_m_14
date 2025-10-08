"use client";

import { useState, useEffect, } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, Camera, Plus } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import MeetingForm from "@/components/meetings/MeetingForm";
import MeetingList from "@/components/meetings/MeetingList";
import { Meeting } from "@/components/meetings/MeetingCard";
import { MeetingType } from "@/types/meetingType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { toast } from "sonner";
// import { useWebSocket } from "@/providers/SocketProvider";
// import router from 'next/router';

type Meetings = {
  _id: string;
  subject: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  notes: string;
  status: "upcoming" | "completed" | "cancelled";
  createdBy: string; // user ID of the creator
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

async function fetchMeetingList(): Promise<Meetings[]> {
  // Simulate fetching meetings from an API or database
  const response = await fetch(
    "/api/listmeetings?userId=682f085814cddb288b5ce447"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch meetings");
  }
  const data = await response.json();
  return data.map((meeting: MeetingType) => ({
    ...meeting,
    date: new Date(meeting.date),
  }));
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // const webSocket = useWebSocket();

  // Demo purposes only - in a real app, we'd check if user is authenticated
  const isAuthenticated = true;

  const { isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: fetchMeetingList,
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // Simulate loading meetings from API/local storage
    const loadMeetings = () => {
      // setIsLoading(true);
      try {
        const storedMeetings = localStorage.getItem("meetings");
        const parsedMeetings = storedMeetings
          ? JSON.parse(storedMeetings).map((meeting: MeetingType) => ({
              ...meeting,
              date: new Date(meeting.date),
            }))
          : generateSampleMeetings();

        setMeetings(parsedMeetings);
      } catch (error) {
        console.error("Error loading meetings", error);
        setMeetings(generateSampleMeetings());
      } finally {
        // setIsLoading(false);
      }
    };

    loadMeetings();
  }, [router, isAuthenticated]);

  // Save meetings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("meetings", JSON.stringify(meetings));
    }
  }, [meetings, isLoading]);

  // useEffect(() => {
  //   webSocket?.on("join_room", handleJoinRoom);
  //   return () => {
  //     webSocket?.off("join_room");
  //   };
  // }, [webSocket])
  

  // const handleJoinRoom = useCallback((data: { roomId: string }) => {
  //   console.log("Room is joined", data);
  // }, []);

  const handleInstandMeeting = async () => {
    const dateNow = new Date();
    const res = await axios.post("/api/createmeeting", {
      subject: "instant meeting",
      date: dateNow,
      time: moment().format("h:mm:ss"),
      duration: 30,
      notes: "",
      meetingType: "public",
    });
    if (res.statusText !== "Created") {
      toast.error("Some thing went wrong", {
        description: `Error: ${res.data?.message}`,
      });
    }
    const room_id = res.data?.room_id;
    console.log(room_id, "room id is here");
    
    if (!room_id) {
      toast.error("Room ID not found");
      return;
    }
    router.push('/meeting-room/'+ room_id)
    // webSocket?.emit("join_room", { roomId: room_id });
  };

  const handleCreateMeeting = (data: Partial<Meeting>) => {
    const newMeeting: Meeting = {
      id: uuidv4(),
      subject: data.subject || "Untitled Meeting",
      date: data.date || new Date(),
      time: data.time || "09:00",
      duration: data.duration || 30,
      notes: data.notes,
    };

    setMeetings((prev) => [...prev, newMeeting]);

    toast("Meeting Scheduled", {
      description: `Successfully scheduled "${newMeeting.subject}"`,
    });
  };

  const handleUpdateMeeting = (id: string, updatedData: Partial<Meeting>) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((meeting) =>
        meeting.id === id ? { ...meeting, ...updatedData } : meeting
      )
    );

    toast("Meeting Updated", {
      description: "Your meeting has been updated successfully",
    });
  };

  const handleDeleteMeeting = (id: string) => {
    const meetingToDelete = meetings.find((m) => m.id === id);

    setMeetings((prevMeetings) =>
      prevMeetings.filter((meeting) => meeting.id !== id)
    );

    toast("Meeting Cancelled", {
      description: meetingToDelete
        ? `"${meetingToDelete.subject}" has been cancelled`
        : "Meeting has been cancelled",
    });
  };

  // Generate sample meetings for demo
  const generateSampleMeetings = (): Meeting[] => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    return [
      {
        id: uuidv4(),
        subject: "Career Guidance Session",
        date: tomorrow,
        time: "10:30",
        duration: 45,
        attendees: ["John Mentor", "You"],
        notes:
          "Discuss career progression and opportunities in the tech industry",
      },
      {
        id: uuidv4(),
        subject: "Resume Review",
        date: nextWeek,
        time: "14:00",
        duration: 30,
        attendees: ["Sarah Expert", "You"],
        notes: "Get feedback on resume formatting and content",
      },
      {
        id: uuidv4(),
        subject: "Interview Preparation",
        date: lastWeek,
        time: "09:00",
        duration: 60,
        attendees: ["Michael Coach", "You"],
        notes: "Mock interview and feedback session",
      },
    ];
  };

  // Calculate stats
  const upcomingMeetingsCount = meetings.filter((meeting) => {
    const meetingDateTime = new Date(meeting.date);
    const [hours, minutes] = meeting.time.split(":").map(Number);
    meetingDateTime.setHours(hours || 0, minutes || 0);
    return meetingDateTime > new Date();
  }).length;

  const totalMeetingMinutes = meetings.reduce(
    (total, meeting) => total + meeting.duration,
    0
  );

  return (
    <main className="flex-1 container mx-auto px-4 py-8 relative ">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-40 w-72 h-72 bg-pink-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              My Meetings
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage your upcoming and past mentorship sessions
            </p>
          </div>

          <Popover>
            <PopoverTrigger>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all">
                <Plus className="mr-2 h-4 w-4" />
                New Meeting
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" asChild>
              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full flex gap-2 justify-start items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule New Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20">
                    <DialogHeader>
                      <DialogTitle>Schedule a New Meeting</DialogTitle>
                    </DialogHeader>
                    <MeetingForm onSubmit={handleCreateMeeting} />
                  </DialogContent>
                </Dialog>
                <Button
                  className="w-full flex gap-2 justify-start items-center"
                  onClick={() => handleInstandMeeting()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Instant Meeting
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl border border-white/20 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Upcoming Meetings
            </h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-bold text-primary">
                {upcomingMeetingsCount}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                scheduled
              </span>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl border border-white/20 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Total Meetings
            </h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-bold text-secondary">
                {meetings.length}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                meetings
              </span>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl border border-white/20 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Total Mentorship Time
            </h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-bold text-primary">
                {Math.floor(totalMeetingMinutes / 60)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                hours
              </span>
              <span className="text-3xl font-bold text-primary ml-2">
                {totalMeetingMinutes % 60}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                minutes
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-4">
              Loading your meetings...
            </h3>
            <Progress value={30} className="max-w-md mx-auto" />
          </div>
        ) : (
          <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 p-6 rounded-xl border border-white/20 shadow-sm">
            <MeetingList
              meetings={meetings}
              onUpdateMeeting={handleUpdateMeeting}
              onDeleteMeeting={handleDeleteMeeting}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default Meetings;
