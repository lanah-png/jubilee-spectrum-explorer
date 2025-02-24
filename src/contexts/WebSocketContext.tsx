
import React, { createContext, useContext, useEffect, useState } from "react";
import { Question, Participant } from "@/types/types";

type WebSocketContextType = {
  participants: Participant[];
  currentQuestion: Question;
  updateParticipant: (participant: Participant) => void;
  assignParticipantToCorner: (participantId: string, corner: number) => void;
  nextQuestion: () => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "1",
    text: "Technology has made our lives better.",
  });

  const connectWebSocket = () => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      // Request initial state when connection opens
      ws.send(JSON.stringify({ type: "GET_INITIAL_STATE" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);
      
      switch (data.type) {
        case "INITIAL_STATE":
          console.log("Setting initial state:", data);
          setParticipants(data.participants || []);
          if (data.currentQuestion) {
            setCurrentQuestion(data.currentQuestion);
          }
          break;
        case "UPDATE_PARTICIPANTS":
          console.log("Updating participants:", data.participants);
          setParticipants(data.participants);
          break;
        case "PARTICIPANT_JOINED":
          console.log("New participant joined:", data.participant);
          setParticipants(prev => {
            // Check if participant already exists
            const exists = prev.some(p => p.id === data.participant.id);
            if (exists) {
              return prev.map(p => 
                p.id === data.participant.id ? data.participant : p
              );
            }
            return [...prev, data.participant];
          });
          break;
        case "UPDATE_QUESTION":
          setCurrentQuestion(data.question);
          break;
        case "CONNECTION_ERROR":
          console.error("WebSocket connection error:", data.error);
          // Attempt to reconnect after a delay
          setTimeout(connectWebSocket, 3000);
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 3000);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  };

  useEffect(() => {
    const cleanup = connectWebSocket();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const updateParticipant = (participant: Participant) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Sending participant update:", participant);
      socket.send(JSON.stringify({
        type: "UPDATE_PARTICIPANT",
        participant
      }));
    }
  };

  const assignParticipantToCorner = (participantId: string, corner: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "ASSIGN_CORNER",
        participantId,
        corner
      }));
    }
  };

  const nextQuestion = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "NEXT_QUESTION"
      }));
    }
  };

  return (
    <WebSocketContext.Provider value={{
      participants,
      currentQuestion,
      updateParticipant,
      assignParticipantToCorner,
      nextQuestion
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};
