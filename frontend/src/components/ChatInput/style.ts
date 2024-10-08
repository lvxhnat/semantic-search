import { IconButton, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColorsEnum } from "../../common/theme";

const dragColor = ColorsEnum.amethyst;

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
  },
  "input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
  },
  padding: `${theme.spacing(2)} ${theme.spacing(3)} 0 ${theme.spacing(3)}`,
  borderRadius: theme.spacing(10),
  backgroundColor: "transparent",
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export const FunctionalityWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "space-between",
  alignItems: "flex-end",
  paddingBottom: "5px",
}));

export const MetaFunctionalityWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: `0px ${theme.spacing(2)}`,
  fontSize: "20px",
  gap: 10,
}));

export const DropBox = styled("div")(({ theme }) => ({
  gap: 5,
  display: "flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  color: dragColor,
}));

interface ChatInputBoxProps {
  isDragActive: boolean;
}

export const ChatInputBox = styled("div")<ChatInputBoxProps>(
  ({ theme, isDragActive }) => ({
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1200px",
    minHeight: "100px",
    color: ColorsEnum.black,
    backgroundColor: isDragActive ? ColorsEnum.coolgray6 : ColorsEnum.lightGrey,
    outline: isDragActive ? `2px dashed ${dragColor}` : "none",
  }),
);
