import React from "react";

interface ErrorMsgProps {
  msg?: string; //string | undefined allow
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({ msg }) => {
  if (!msg) return null; // agar error message nahi hai to kuch render mat karo
  return <div style={{ color: "red" }}>{msg}</div>;
};

export default ErrorMsg;
