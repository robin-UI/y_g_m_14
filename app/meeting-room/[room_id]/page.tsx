"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useWebSocket } from "@/providers/SocketProvider";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import peerService from "@/helpers/peer";

interface Message {
  id: string;
  text: string;
  sender: "user" | "mentor";
  timestamp: Date;
}

interface JoinRequest {
  userId: string;
  nickname: string;
  socketId: string;
}

const MeetingRoom = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Notification sound function
  const playNotificationSound = (type: 'message' | 'request' | 'admitted') => {
    try {
      // const audio = new Audio();
      // Using different frequencies for different notification types
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Different sounds for different types
      if (type === 'message') {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.3);
      } else if (type === 'request') {
        // Two tone notification for join request
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.2);

        const oscillator2 = context.createOscillator();
        const gainNode2 = context.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(context.destination);
        oscillator2.frequency.value = 800;
        gainNode2.gain.setValueAtTime(0.3, context.currentTime + 0.2);
        oscillator2.start(context.currentTime + 0.2);
        oscillator2.stop(context.currentTime + 0.4);
      } else if (type === 'admitted') {
        // Success sound for admission
        oscillator.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };
  const [inputValue, setInputValue] = useState("");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<string>("");
  const [remoteUserName, setRemoteUserName] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const room_id = params.room_id as string;

  // Authentication & Nickname Modal States
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  // Host Admission Control States
  const [isHost, setIsHost] = useState(false);
  // const [meetingCreatorId, setMeetingCreatorId] = useState<string>("");
  // const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<JoinRequest | null>(
    null
  );
  const [showAdmissionAlert, setShowAdmissionAlert] = useState(false);

  const webSocket = useWebSocket();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize camera and add tracks to peer connection
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Add tracks to peer connection
        for (const track of stream.getTracks()) {
          peerService.peer.addTrack(track, stream);
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast.error("Camera Error", {
          description: "Could not access camera/microphone",
        });
      }
    };

    initCamera();

    return () => {
      if (localVideoRef.current?.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const stream = localVideoRef.current?.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle incoming offer (for answering peer)
  const handleIncomingCall = useCallback(
    async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log("Incoming call from:", from);
      setRemoteSocketId(from);
      const ans = await peerService.getAnswer(offer);
      webSocket?.emit("answer", { to: from, answer: ans });
    },
    [webSocket]
  );

  // Handle answer (for calling peer)
  const handleCallAccepted = useCallback(
    async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      console.log("Call accepted, setting remote description");
      await peerService.setLocalDescription(answer);
    },
    []
  );

  // Handle ICE candidates
  const handleIceCandidate = useCallback(
    ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
      console.log("Received ICE candidate from:", from);
      peerService.peer.addIceCandidate(new RTCIceCandidate(candidate));
    },
    []
  );

  // Handle incoming tracks (remote video/audio)
  useEffect(() => {
    const handleTrack = (ev: RTCTrackEvent) => {
      console.log("GOT TRACKS!!", ev.streams);
      const [stream] = ev.streams;
      setRemoteStream(stream);
    };

    peerService.peer.addEventListener("track", handleTrack);

    return () => {
      peerService.peer.removeEventListener("track", handleTrack);
    };
  }, []);

  // Update remote video when stream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Send ICE candidates to remote peer
  useEffect(() => {
    const handleIceCandidateEvent = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate && remoteSocketId) {
        console.log("Sending ICE candidate to:", remoteSocketId);
        webSocket?.emit("ice_candidate", {
          to: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    peerService.peer.addEventListener("icecandidate", handleIceCandidateEvent);

    return () => {
      peerService.peer.removeEventListener("icecandidate", handleIceCandidateEvent);
    };
  }, [remoteSocketId, webSocket]);

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    // Close peer connection
    peerService.peer.close();

    // Emit leave event to socket
    webSocket?.emit("leave_room", { roomId: room_id });

    toast("Call Ended", {
      description: "The meeting has been ended",
    });

    // Redirect based on user type
    if (isHost) {
      router.push('/meetings');
    } else {
      router.push('/');
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Emit message to socket
    webSocket?.emit("send_message", {
      roomId: room_id,
      message: inputValue,
      sender: session?.user?.username || nickname || "Guest",
    });

    setInputValue("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Fetch meeting details to determine host
  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await fetch(`/api/get-meeting?meetingId=${room_id}`);
        const data = await response.json();

        if (data.meeting) {
          // setMeetingCreatorId(data.meeting.createdBy);

          // Check if current user is the host
          if (session?.user?._id === data.meeting.createdBy) {
            setIsHost(true);
          }
        }
      } catch (error) {
        console.error("Error fetching meeting details:", error);
      }
    };

    if (status === "authenticated" && session) {
      fetchMeetingDetails();
    }
  }, [room_id, session, status]);

  // Check authentication on mount
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setShowNicknameModal(true);
      setIsJoined(true);
    } else if (status === "authenticated") {
      setIsJoined(true);
    }
  }, [status]);

  // Handle nickname submission for non-logged users
  const handleNicknameSubmit = () => {
    if (!nickname.trim()) {
      toast.error("Please enter a nickname");
      return;
    }

    // Emit join request to host via socket
    webSocket?.emit("request_join", {
      roomId: room_id,
      userId: "guest_" + Date.now(),
      nickname: nickname.trim(),
    });

    setShowNicknameModal(false);
    toast.info("Waiting for host approval...");
  };

  // Handle join request for host
  const handleJoinRequest = useCallback(
    (request: JoinRequest) => {
      // Only show admission alert if current user is the host
      if (!isHost) {
        console.log("Received join request but user is not host");
        return;
      }

      // Play notification sound
      playNotificationSound('request');

      // setJoinRequests((prev) => [...prev, request]);
      setCurrentRequest(request);
      setShowAdmissionAlert(true);
    },
    [isHost]
  );

  // Host admits user and initiates call
  const handleAdmit = async () => {
    if (!currentRequest) return;

    webSocket?.emit("admit_user", {
      roomId: room_id,
      socketId: currentRequest.socketId,
      userId: currentRequest.userId,
    });

    toast.success(`${currentRequest.nickname} admitted to the meeting`);

    // Set remote socket ID and name, then initiate WebRTC call
    setRemoteSocketId(currentRequest.socketId);
    setRemoteUserName(currentRequest.nickname);

    // Create and send offer to admitted user
    try {
      const offer = await peerService.getOffer();
      webSocket?.emit("offer", {
        to: currentRequest.socketId,
        offer,
      });
      console.log("Sent offer to:", currentRequest.socketId);
    } catch (error) {
      console.error("Error creating offer:", error);
    }

    // Remove from queue and show next request if any
    // setJoinRequests((prev) =>
    //   prev.filter((req) => req.socketId !== currentRequest.socketId)
    // );
    setShowAdmissionAlert(false);

    // Show next request if available
    // setTimeout(() => {
    //   setJoinRequests((prev) => {
    //     if (prev.length > 0) {
    //       setCurrentRequest(prev[0]);
    //       setShowAdmissionAlert(true);
    //     } else {
    //       setCurrentRequest(null);
    //     }
    //     return prev;
    //   });
    // }, 300);
  };

  // Host denies user
  const handleDeny = () => {
    if (!currentRequest) return;

    webSocket?.emit("deny_user", {
      roomId: room_id,
      socketId: currentRequest.socketId,
      userId: currentRequest.userId,
    });

    toast.error(`${currentRequest.nickname} denied entry`);

    // Remove from queue and show next request if any
    // setJoinRequests((prev) =>
    //   prev.filter((req) => req.socketId !== currentRequest.socketId)
    // );
    setShowAdmissionAlert(false);

    // Show next request if available
    // setTimeout(() => {
    //   setJoinRequests((prev) => {
    //     if (prev.length > 0) {
    //       setCurrentRequest(prev[0]);
    //       setShowAdmissionAlert(true);
    //     } else {
    //       setCurrentRequest(null);
    //     }
    //     return prev;
    //   });
    // }, 300);
  };

  // Handle admission response for guest users
  const handleAdmissionResponse = useCallback((data: { admitted: boolean; hostName?: string; hostSocketId?: string }) => {
    if (data.admitted) {
      // Play success notification sound
      playNotificationSound('admitted');

      setIsJoined(true);
      toast.success("You have been admitted to the meeting");

      // Set host name and socket ID
      if (data.hostName) {
        setRemoteUserName(data.hostName);
      }
      if (data.hostSocketId) {
        setRemoteSocketId(data.hostSocketId);
      }
    } else {
      toast.error("Your request was denied by the host");
      // Optionally redirect or show retry option
    }
  }, []);

  const handleJoinRoom = useCallback((data: { roomId: string }) => {
    console.log("Room is joined", data);
  }, []);

  // Handle incoming chat messages
  const handleReceiveMessage = useCallback((data: { id: string; text: string; sender: string; timestamp: string; socketId: string }) => {
    const newMessage: Message = {
      id: data.id,
      text: data.text,
      sender: data.socketId === webSocket?.id ? "user" : "mentor",
      timestamp: new Date(data.timestamp),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Play notification sound only for messages from others
    if (data.socketId !== webSocket?.id) {
      playNotificationSound('message');
    }
  }, [webSocket]);

  // Handle when another user joins the room
  const handleUserJoined = useCallback(
    async ({ username, socketId }: { username: string; socketId: string }) => {
      console.log("User joined:", username, socketId);

      // Only process this if I'm the host
      // Guests will get their remote user info from admission_response
      if (isHost) {
        toast.info(`${username} joined the meeting`);

        // Set remote user name (guest's nickname)
        setRemoteUserName(username);
        setRemoteSocketId(socketId);

        try {
          const offer = await peerService.getOffer();
          webSocket?.emit("offer", {
            to: socketId,
            offer,
          });
          console.log("Sent offer to new user:", socketId);
        } catch (error) {
          console.error("Error creating offer for new user:", error);
        }
      }
    },
    [isHost, webSocket]
  );

  // Handle when another user leaves the room
  const handleUserLeft = useCallback(
    ({ username }: { socketId: string; username: string }) => {
      console.log("User left:", username);
      toast.info(`${username} left the meeting`);

      // Stop local media
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      // Close peer connection
      peerService.peer.close();

      // Redirect based on user type
      setTimeout(() => {
        if (isHost) {
          router.push('/meetings');
        } else {
          router.push('/');
        }
      }, 1500);
    },
    [isHost, router]
  );

  // Socket event listeners
  useEffect(() => {
    if (!webSocket) return;

    // If authenticated user, join directly
    if (status === "authenticated" && session) {
      webSocket.emit("join_room", {
        roomId: room_id,
        userId: session.user._id,
        username: session.user.username,
      });
    }

    webSocket.on("join_room", handleJoinRoom);
    webSocket.on("user_joined", handleUserJoined);
    webSocket.on("user_left", handleUserLeft);
    webSocket.on("join_request", handleJoinRequest);
    webSocket.on("admission_response", handleAdmissionResponse);
    webSocket.on("receive_message", handleReceiveMessage);
    webSocket.on("offer", handleIncomingCall);
    webSocket.on("answer_final", handleCallAccepted);
    webSocket.on("ice_candidate", handleIceCandidate);

    return () => {
      webSocket.off("join_room");
      webSocket.off("user_joined", handleUserJoined);
      webSocket.off("user_left", handleUserLeft);
      webSocket.off("join_request");
      webSocket.off("admission_response");
      webSocket.off("receive_message", handleReceiveMessage);
      webSocket.off("offer", handleIncomingCall);
      webSocket.off("answer_final", handleCallAccepted);
      webSocket.off("ice_candidate", handleIceCandidate);
    };
  }, [
    webSocket,
    room_id,
    status,
    session,
    handleJoinRoom,
    handleUserJoined,
    handleUserLeft,
    handleJoinRequest,
    handleAdmissionResponse,
    handleReceiveMessage,
    handleIncomingCall,
    handleCallAccepted,
    handleIceCandidate,
  ]);

  // Don't render meeting UI until user is joined
  if (!isJoined && status !== "authenticated") {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Waiting to join the meeting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Nickname Modal for Non-Logged Users */}
      <Dialog open={showNicknameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Meeting</DialogTitle>
            <DialogDescription>
              Please enter a nickname to join this meeting
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNicknameSubmit()}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleNicknameSubmit}>Join Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Host Admission Alert */}
      <AlertDialog open={showAdmissionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Join Request</AlertDialogTitle>
            <AlertDialogDescription>
              {currentRequest?.nickname} wants to join the meeting. Do you want
              to admit them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeny}>Deny</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdmit}>Admit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">
              Meeting Room
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              1-on-1 Mentorship Session
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs sm:text-sm text-foreground">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Video Section */}
        <div className="flex-1 p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 relative">
          {/* Remote Video (Large) */}
          {remoteUserName && (
            <div className="flex-1 relative rounded-lg sm:rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 px-2 sm:px-3 py-1 bg-card/90 backdrop-blur-sm rounded-md sm:rounded-lg border border-border">
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {remoteUserName || "Guest"}
                </span>
              </div>
            </div>
          )}

          {/* Local Video (Small - Picture in Picture on mobile) */}
          
          <div className={` ${!remoteUserName ? "w-full h-full relative" : "absolute bottom-4 right-4 w-28 h-40 sm:w-32 sm:h-44 md:w-full md:h-48 lg:w-64 lg:h-48"}  rounded-lg sm:rounded-xl overflow-hidden bg-muted border-2 border-border shadow-lg z-10`}>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                !isVideoOn ? "hidden" : ""
              }`}
            />
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 border-2 border-primary">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg sm:text-xl md:text-2xl bg-primary text-primary-foreground">
                    Y
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute bottom-1.5 sm:bottom-2 md:bottom-3 left-1.5 sm:left-2 md:left-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-card/90 backdrop-blur-sm rounded border border-border">
              <span className="text-[10px] sm:text-xs font-medium text-foreground">You</span>
            </div>
          </div>
        </div>

        {/* Chat Section - Overlay on mobile, Sidebar on desktop */}
        <div
          className={`${
            isChatOpen
              ? "fixed md:relative inset-0 md:inset-auto md:w-96 z-20"
              : "hidden"
          } transition-all duration-300`}
        >
          <div className="h-full bg-card md:border-l border-border flex flex-col">
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-sm sm:text-base font-semibold text-foreground">
                Meeting Chat
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-2.5 sm:p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                    }`}
                  >
                    <p className="text-xs sm:text-sm">{message.text}</p>
                    <span
                      className={`text-[10px] sm:text-xs block mt-1 ${
                        message.sender === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary-dark text-xs sm:text-sm px-3 sm:px-4"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-card border-t border-border px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {isVideoOn ? (
              <Video className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <VideoOff className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {isAudioOn ? (
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
          >
            <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`rounded-full w-12 h-12 sm:w-14 sm:h-14 ${
              isChatOpen
                ? "bg-primary text-primary-foreground border-primary"
                : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
