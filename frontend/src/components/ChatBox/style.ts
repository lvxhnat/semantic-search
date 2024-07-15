import { styled } from "@mui/material/styles";
import { ColorsEnum } from "../../common/theme";
import { Typography } from "@mui/material";

export const ChatBoxWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  padding: 1,
}));

export const ChatBox = styled(Typography)(({ theme }) => ({
  maxWidth: "70%",
  backgroundColor:
    theme.palette.mode === "dark" ? ColorsEnum.darkGrey : ColorsEnum.lightGrey,
  color: theme.palette.mode === "dark" ? ColorsEnum.white : ColorsEnum.black,
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
