
import { Button } from "@/components/ui/button";
import { useState } from "react";
import HostView from "@/components/HostView";
import ParticipantView from "@/components/ParticipantView";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

const Index = () => {
  const [view, setView] = useState<"select" | "host" | "participant">("select");

  if (view === "host") return (
    <WebSocketProvider>
      <HostView />
    </WebSocketProvider>
  );
  
  if (view === "participant") return (
    <WebSocketProvider>
      <ParticipantView />
    </WebSocketProvider>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold mb-8">Discussion Corner</h1>
        <div className="space-y-4">
          <Button
            className="w-64"
            size="lg"
            onClick={() => setView("host")}
          >
            Host View
          </Button>
          <div>
            <Button
              className="w-64"
              variant="outline"
              size="lg"
              onClick={() => setView("participant")}
            >
              Join as Participant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
