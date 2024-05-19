import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", {
    email: email,
    password: password,
  });
  if (res.status !== 200) {
    throw new Error("Unable to login.");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post("/user/signup", {
    name: name,
    email: email,
    password: password,
  });
  if (res.status !== 201) {
    throw new Error("Unable to signup.");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  console.log("check status:", res.headers);
  
  if (res.status !== 200) {
    throw new Error("Unable to authenticate.");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string) => {
  // console.log("sendChatRequest client");

  const res = await axios.post("/chat/new", { message });
  // console.log("response sendChatRequest:", res);

  if (res.status !== 200) {
    throw new Error("Unable to send chat.");
  }
  const data = await res.data;
  return data;
};

export const getUserChats = async () => {
  // console.log("getUserChat client");

  const res = await axios.get("/chat/all-chats");
  // console.log("response getUserChats:", res);

  if (res.status !== 200) {
    throw new Error("Unable to get chats.");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  // console.log("deleteUserChats client");

  const res = await axios.delete("/chat/delete");
  // console.log("response deleteUserChats:", res);

  if (res.status !== 200) {
    throw new Error("Unable to delete chats.");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  // console.log("logoutUser client");
  const res = await axios.get("/user/logout");
  // console.log("response logoutUser:", res);

  if (res.status !== 200) {
    throw new Error("Unable to logout User.");
  }
  const data = await res.data;
  return data;
};
