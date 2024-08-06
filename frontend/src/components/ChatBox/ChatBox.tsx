import * as S from "./style";
import Logo from "../../assets/logo.png";

export type Roles = "user" | "system";

export interface ReferenceIds {
  [uuid: string]: number
}

export interface ChatBoxType {
  role: Roles;
  content: string;
  reference_ids: ReferenceIds; // These will store the uuids of the table entries that the llm has referenced
}

interface ChatBoxProps {
  user: Roles;
  align?: string;
  children?: any;
  [others: string]: any;
}

export default function ChatBox(props: ChatBoxProps) {
  return (
    <S.ChatBoxWrapper
      {...props.others}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: props.user === "user" ? "flex-end" : "flex-start",
      }}
    >
      {props.user === "system" ? (
        <img src={Logo} alt="" width="35px" style={{ marginTop: "10px" }} />
      ) : null}
      <S.ChatBox role={props.user}>
        {props.children}
      </S.ChatBox>
    </S.ChatBoxWrapper>
  );
}
