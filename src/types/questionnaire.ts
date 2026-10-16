export type QuestionThreadStatus = "OPEN" | "CLOSED";

export type QuestionnaireMessage = {
  id: string;
  threadId: string;
  senderId: string;
  messageBody: string;
  readAt: string | null;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: "CLIENT" | "DIETICIAN" | "ADMIN";
  };
};

export type QuestionnaireThreadBundle = {
  thread: {
    id: string;
    clientId: string;
    dieticianId: string;
    status: QuestionThreadStatus;
    lastMessageAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  messages: QuestionnaireMessage[];
  unreadCount: number;
};
