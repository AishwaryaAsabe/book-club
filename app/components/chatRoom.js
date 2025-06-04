"use client";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import ChatMemberList from "../../components/chat/ChatMemberList";
import ChatMessageList from "../../components/chat/ChatMessageList";
import ChatInput from "../../components/chat/ChatInput";
import "../../styles/chatRoom.css";
import { getSocket, disconnectSocket } from "../lib/socket";

const ChatRoom = () => {
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId;
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [clubInfo, setClubInfo] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef();
  const socketRef = useRef(null);

  // Get current user
  // Modified current user fetch
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        if (!data?.user) {
          throw new Error("No user data");
        }

        setCurrentUser(data.user);

        // If using Option 2 where token is returned:
        if (data.token) {
          Cookies.set("client-token", data.token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: 7,
          });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        router.push("/login");
      }
    };

    fetchCurrentUser();
  }, [router]);

  // Modified socket connection
  // useEffect(() => {
  //   if (!currentUser) return;

  //   const token = Cookies.get("client-token"); // Now using client-accessible token
  //   if (!token) {
  //     router.push("/login");
  //     return;
  //   }

  //   // ... rest of socket connection code
  // }, [currentUser, router]);

  // Fetch club info
  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        const response = await fetch(`/api/clubs/${clubId}`);
        const data = await response.json();
        setClubInfo({
          name: data.name,
          members: data.members,
          imageUrl: data.imageUrl || "/default-club-icon.png",
        });
      } catch (error) {
        console.error("Error fetching club info:", error);
      }
    };

    fetchClubInfo();
  }, [clubId]);

  // Socket connection and listeners
  // In your ChatRoom.js, update the socket useEffect:
  useEffect(() => {
    if (!currentUser) return; // Don't connect without user data

    // 1. Get token from cookies
    const token = Cookies.get("client-token");
    if (!token) {
      console.error("No token available");
      router.push("/login");
      return;
    }

    let socket;
    try {
      // 2. Initialize socket connection
      socket = getSocket(token);
      socketRef.current = socket;

      // 3. Connection handlers
      const onConnect = () => {
        console.log("Socket connected");
        setSocketConnected(true);
        socket.emit("joinClub", clubId); // Join specific room
      };

      const onDisconnect = (reason) => {
        console.log("Socket disconnected:", reason);
        setSocketConnected(false);
      };

     // In your ChatRoom component
const onConnectError = (err) => {
  console.error("Connection error:", err.message);
  if (err.message.includes("auth") || err.message.includes("secret")) {
    Cookies.remove("client-token");
    router.push("/login");
  }
};

      const onNewMessage = (msg) => {
        // Update UI with new message
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id,
            sender: msg.userId.name,
            avatar: msg.userId.avatar || "/default-avatar.png",
            message: msg.text,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: msg.userId._id === currentUser._id,
          },
        ]);
      };

      // 4. Register event listeners
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("connect_error", onConnectError);
      socket.on("newMessage", onNewMessage);

      // 5. Actively connect if needed
      if (socket.disconnected) {
        socket.connect();
      }

      // 6. Cleanup function
      return () => {
        console.log("Cleaning up socket...");
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("connect_error", onConnectError);
        socket.off("newMessage", onNewMessage);
        disconnectSocket(); // Properly disconnect
      };
    } catch (err) {
      console.error("Socket initialization error:", err);
       if (socketInstance && !isSocketConnected()) {
      disconnectSocket();
    }
      router.push("/login");
    }
  }, [clubId, currentUser, router]); // Re-run when these values change
  // Fetch messages when currentUser is ready
  // // In your ChatRoom component
useEffect(() => {
    if (!currentUser) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/discussions/${clubId}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        const formattedMessages = data.map((msg) => ({
          id: msg._id,
          sender: msg.userId?.name || "Unknown",
          avatar: msg.userId?.avatar || "/default-avatar.png",
          message: msg.text,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: msg.userId?._id === currentUser._id,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [clubId, currentUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (message) => {
    try {
      if (!socketRef.current || !currentUser) {
        throw new Error("Socket or user not available");
      }

      console.log("Sending message:", message);
      socketRef.current.emit(
        "send_message",
        {
          text: message,
          clubId,
          userId: currentUser._id,
        },
        (ack) => {
          if (ack?.error) {
            console.error("Error sending message:", ack.error);
          }
        }
      );
    } catch (err) {
      console.error("Message send error:", err);
    }
  };
  

  return (
    <div className="chat-room-container">
      <header className="chat-header">
        <div className="chat-header-left">
          <Link href={`/clubs/${clubId}`} className="back-button">
            <ArrowLeft className="back-icon" />
          </Link>
          <div
            className="club-info-header"
            onClick={() => setShowMembers(!showMembers)}
          >
            <img
              src={clubInfo?.imageUrl || "/default-club-icon.png"}
              alt={clubInfo?.name || "Club"}
              className="club-avatar-header"
            />
            <div className="club-details-header">
              <h1 className="club-name-header">
                {clubInfo?.name || "Loading..."}
              </h1>
              <p className="club-members-count">
                {clubInfo?.members ?? 0} members
              </p>
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="header-action-btn">
            <Video className="action-icon" />
          </button>
          <button className="header-action-btn">
            <Phone className="action-icon" />
          </button>
          <button className="header-action-btn">
            <MoreVertical className="action-icon" />
          </button>
        </div>
      </header>

      <div className="chat-main-content">
        {showMembers && (
          <ChatMemberList
            onClose={() => setShowMembers(false)}
            clubId={clubId}
          />
        )}
        <div className="chat-area">
          <ChatMessageList messages={messages} />
          <div ref={bottomRef} />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
