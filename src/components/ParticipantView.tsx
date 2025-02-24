
import { useState } from "react";
import { Opinion } from "@/types/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Square } from "lucide-react";

const ParticipantView = () => {
  const [name, setName] = useState("");
  const [opinion, setOpinion] = useState<Opinion | null>(null);
  const [corner, setCorner] = useState<number | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    if (!name.trim()) return;
    setIsJoined(true);
    // TODO: Add websocket connection logic here
  };

  const opinions: { value: Opinion; label: string }[] = [
    { value: "stronglyDisagree", label: "Strongly Disagree" },
    { value: "disagree", label: "Disagree" },
    { value: "neutral", label: "Neutral" },
    { value: "agree", label: "Agree" },
    { value: "stronglyAgree", label: "Strongly Agree" },
  ];

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-md mx-auto space-y-8">
        {!isJoined ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center">Join Discussion</h1>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleJoin}
              disabled={!name.trim()}
            >
              Join
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-center">Current Question</h1>
            <div className="text-center text-lg">
              Technology has made our lives better.
            </div>

            {corner ? (
              <div className="text-center space-y-4">
                <div className="text-xl font-semibold">Your Corner</div>
                <div className="flex items-center justify-center gap-2">
                  <Square className="h-8 w-8" />
                  <span className="text-2xl">Corner {corner}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <RadioGroup
                  value={opinion || ""}
                  onValueChange={(value) => setOpinion(value as Opinion)}
                >
                  {opinions.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label htmlFor={opt.value}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantView;
