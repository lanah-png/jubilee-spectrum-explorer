
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Square, UserCheck } from "lucide-react";
import { useState } from "react";
import { Participant } from "@/types/types";

const HostView = () => {
  const { currentQuestion, participants, assignParticipantToCorner, nextQuestion } = useWebSocket();
  const { toast } = useToast();
  const [draggingParticipant, setDraggingParticipant] = useState<string | null>(null);

  const handleDragStart = (participantId: string) => {
    setDraggingParticipant(participantId);
  };

  const handleDrop = (corner: number) => {
    if (draggingParticipant) {
      assignParticipantToCorner(draggingParticipant, corner);
      setDraggingParticipant(null);
      toast({
        title: "Participant Assigned",
        description: `Participant has been assigned to corner ${corner}`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNextQuestion = () => {
    nextQuestion();
    toast({
      title: "Next Question",
      description: "Moving to the next discussion topic.",
    });
  };

  const getParticipantStatus = (participant: Participant) => {
    if (participant.corner) {
      return <UserCheck className="h-4 w-4 text-green-500" />;
    }
    if (participant.opinion) {
      return <UserCheck className="h-4 w-4 text-blue-500" />;
    }
    return <User className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Host View</h1>
          <div className="text-2xl font-semibold text-primary">
            {currentQuestion.text}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={handleNextQuestion}
              size="lg"
            >
              Next Question
            </Button>

            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              <div className="space-y-2">
                {participants.map(p => (
                  <div
                    key={p.id}
                    draggable={!p.corner}
                    onDragStart={() => handleDragStart(p.id)}
                    className={`flex items-center justify-between p-2 rounded ${
                      !p.corner ? 'cursor-move hover:bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getParticipantStatus(p)}
                      <span>{p.name}</span>
                    </div>
                    {p.corner && (
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4" />
                        <span>Corner {p.corner}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(corner => (
              <div
                key={corner}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(corner)}
                className="border rounded-lg p-4 min-h-[150px]"
              >
                <h3 className="text-lg font-semibold mb-2">Corner {corner}</h3>
                <div className="space-y-1">
                  {participants
                    .filter(p => p.corner === corner)
                    .map(p => (
                      <div key={p.id} className="flex items-center gap-2">
                        <Square className="h-4 w-4" />
                        <span>{p.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostView;
