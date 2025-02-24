
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Square } from "lucide-react";

const HostView = () => {
  const { currentQuestion, participants, assignCorners, nextQuestion } = useWebSocket();
  const { toast } = useToast();

  const handleAssignCorners = () => {
    assignCorners();
    toast({
      title: "Corners Assigned",
      description: "Participants can now move to their designated corners.",
    });
  };

  const handleNextQuestion = () => {
    nextQuestion();
    toast({
      title: "Next Question",
      description: "Moving to the next discussion topic.",
    });
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

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={handleAssignCorners}
              size="lg"
            >
              Assign Corners
            </Button>
            <Button 
              className="w-full" 
              onClick={handleNextQuestion}
              variant="outline"
              size="lg"
            >
              Next Question
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Participants: {participants.length}</h2>
            <div className="space-y-2">
              {participants.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <span>{p.name}</span>
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

        <div className="grid grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4].map(corner => (
            <div key={corner} className="border rounded-lg p-4">
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
  );
};

export default HostView;
