
export type Opinion = "stronglyDisagree" | "disagree" | "neutral" | "agree" | "stronglyAgree";

export type Participant = {
  id: string;
  name: string;
  opinion: Opinion | null;
  corner: number | null;
};

export type Question = {
  id: string;
  text: string;
};
