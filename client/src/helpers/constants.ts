const ROLE_USER = "user";
const ROLE_ASSISTANT = "assistant";
const DEFAULT_CHAT_MESSAGES = [
  {
    role: "user",
    content: "Hi there! How can I help you today?",
  },
  {
    role: "assistant",
    content: "Hello! I'm here to assist you. What do you need help with?",
  },
  {
    role: "user",
    content: "I'm having trouble with my computer. It keeps crashing.",
  },
  {
    role: "assistant",
    content:
      "That sounds frustrating. Have you tried restarting your computer?",
  },
  {
    role: "user",
    content: "Yes, I've tried that multiple times, but the issue persists.",
  },
  {
    role: "assistant",
    content:
      "Let's try running a virus scan to see if there's any malware causing the problem.",
  },
  {
    role: "user",
    content: "Good idea. I'll do that now.",
  },
  {
    role: "assistant",
    content: "Great! Let me know if you need further assistance.",
  },
];

export { ROLE_USER, ROLE_ASSISTANT, DEFAULT_CHAT_MESSAGES };
