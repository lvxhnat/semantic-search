import * as S from "./style";
import Logo from "../../assets/logo.png"

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
        alignItems: "flex-start",
        justifyContent: props.user === "user" ? "flex-end" : "flex-start",
      }}
    >
      {props.user === "system" ? <img src={Logo} alt="" width="35px" style={{ marginTop: "10px" }} /> : null}
      <S.ChatBox paragraph role={props.user}>
          {props.children}
      </S.ChatBox>
    </S.ChatBoxWrapper>
  );
}
