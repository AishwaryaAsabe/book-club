import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzZiN2M2NTFiNjEyYjcxZGI0OWY3YyIsImVtYWlsIjoiSm9obkBleGFtcGxlLmNvbSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTc0ODQ1OTIyNiwiZXhwIjoxNzQ5MDY0MDI2fQ.s1x_Frnd9FLRPHRdopErUlMldRfKroJTBuTsup_KtLs"  // Replace with a valid JWT signed with your JWT_SECRET, user ID inside payload
  }
});

socket.on("connect", () => {
  console.log("Connected with ID:", socket.id);
  
  // Example: Join a call
  socket.emit("joinCall", { callId: "683766f833faac8af06d2f3a" });
});

socket.on("joinedCall", (callId) => {
  console.log("Joined call:", callId);
});

socket.on("participantJoined", (data) => {
  console.log("Participant joined:", data);
});

socket.on("error", (message) => {
  console.error("Error:", message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
