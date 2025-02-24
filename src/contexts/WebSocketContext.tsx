
import React, { createContext, useContext, useEffect, useState } from "react";
import { Question, Participant } from "@/types/types";

type WebSocketContextType = {
  participants: Participant[];
  currentQuestion: Question;
  updateParticipant: (participant: Participant) => void;
  assignCorners: () => void;
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

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "UPDATE_PARTICIPANTS":
          setParticipants(data.participants);
          break;
        case "UPDATE_QUESTION":
          setCurrentQuestion(data.question);
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
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const updateParticipant = (participant: Participant) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "UPDATE_PARTICIPANT",
        participant
      }));
    }
  };

  const assignCorners = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "ASSIGN_CORNERS"
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
      assignCorners,
      nextQuestion
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

