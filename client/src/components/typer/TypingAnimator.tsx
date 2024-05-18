import { TypeAnimation } from "react-type-animation";

function TypingAnimator() {
  return (
    <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed once, initially
        "Chat with TES-AI GPT",
        1000,
        "Powered by OpenAI and Hayanson Solutions🤚🏻",
        1000,
        "Talk to an Ancient Philosopher of Wisdom",
        1000,
        "With the latest knowledge provided by AI 🖥️",
        1000,
      ]}
      speed={50}
      style={{
        fontSize: "60px",
        color: "white",
        display: "inline-block",
        textShadow: "1px 1px 20px #000",
      }}
      repeat={Infinity}
    />
  );
}

export default TypingAnimator;
