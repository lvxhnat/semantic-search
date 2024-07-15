import * as React from "react";
import * as S from "./style";
import { Typography } from "@mui/material";

export type Conversers = "user" | "admin";

export interface ChatBoxType {
  user: Conversers;
  text: string;
}

interface ChatBoxProps {
  user: Conversers;
  children?: string;
}

export default function ChatBox(props: ChatBoxProps) {
  return (
    <S.ChatBoxWrapper
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: props.user === "user" ? "flex-end" : "flex-start",
      }}
    >
      <S.ChatBox paragraph>
          {props.children}
      </S.ChatBox>
    </S.ChatBoxWrapper>
  );
}
