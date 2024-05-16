const ROLE_USER = "User";
const ROLE_ASSISTANT = "Assistant";
const DEFAULT_CHAT_MESSAGES = [
  {
    role: "User",
    content: "Hi there! How can I help you today?",
  },
  {
    role: "Assistant",
    content: "Hello! I'm here to assist you. What do you need help with?",
  },
  {
    role: "User",
    content: "I'm having trouble with my computer. It keeps crashing.",
  },
  {
    role: "Assistant",
    content:
      "That sounds frustrating. Have you tried restarting your computer?",
  },
  {
    role: "User",
    content: "Yes, I've tried that multiple times, but the issue persists.",
  },
  {
    role: "Assistant",
    content:
      "Let's try running a virus scan to see if there's any malware causing the problem.",
  },
  {
    role: "User",
    content: "Good idea. I'll do that now.",
  },
  {
    role: "Assistant",
    content: "Great! Let me know if you need further assistance.",
  },
];

export { ROLE_USER, ROLE_ASSISTANT, DEFAULT_CHAT_MESSAGES };
