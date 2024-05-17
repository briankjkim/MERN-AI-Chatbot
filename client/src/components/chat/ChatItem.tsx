/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { ROLE_ASSISTANT } from "../../helpers/constants";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
}

function isCodeBlock(text: string) {
  if (
    text.includes("=") ||
    text.includes(";") ||
    text.includes("[") ||
    text.includes("]") ||
    text.includes("{") ||
    text.includes("}") ||
    text.includes("#") ||
    text.includes("//")
  ) {
    return true;
  }
  return false;
}

function extractLanguage(text: string) {
  const languageRegex = /^\w+/;
  const match = text.match(languageRegex);
  // console.log("detected language:", match?.[0]);
  if (match) {
    return match[0];
  }
  return;
}

const ChatItem = ({ content, role }: { content: string; role: string }) => {
  const auth = useAuth();
  const messageBlocks = extractCodeFromString(content);

  return role === ROLE_ASSISTANT ? (
    <Box sx={{ display: "flex", p: 2, bgcolor: "#004d5612", my: 2, gap: 2 }}>
      <Avatar sx={{ ml: "0" }}>
        <img src="openai.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box>
        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block, index) =>
            isCodeBlock(block) ? (
              <React.Fragment key={index}>
                <SyntaxHighlighter
                  style={coldarkDark}
                  language={extractLanguage(block)}
                >
                  {block}
                </SyntaxHighlighter>
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>
                <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
              </React.Fragment>
            )
          )}
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: "flex", p: 2, bgcolor: "#004d56", gap: 2, my: 2 }}>
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {auth?.user?.name[0]}
        {auth?.user?.name.split(" ")[1][0]}{" "}
      </Avatar>
      <Box>
        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter
                style={coldarkDark}
                language={extractLanguage(block)}
              >
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
            )
          )}
      </Box>
    </Box>
  );
};

export default ChatItem;
