import * as S from "./style";

export type Roles = "user" | "system";

export interface ChatBoxType {
  role: Roles;
  content: string;
}

interface ChatBoxProps {
  user: Roles;
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
