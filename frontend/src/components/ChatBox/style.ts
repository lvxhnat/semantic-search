import { styled } from "@mui/material/styles";
import { ColorsEnum } from "../../common/theme";
import { Typography } from "@mui/material";
import { Roles } from "./ChatBox";

export const ChatBoxWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  padding: 1,
}));

interface ChatBoxProps {
  role: Roles;
}
export const ChatBox = styled("div")<ChatBoxProps>(({ theme, role }) => ({
  gap: 20,
  maxWidth: "80%",
  color: theme.palette.mode === "dark" ? ColorsEnum.white : ColorsEnum.black,
  backgroundColor:
    role === "system"
      ? "transparent"
      : theme.palette.mode === "dark"
      ? ColorsEnum.darkGrey
      : ColorsEnum.lightGrey,
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  borderRadius: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));
