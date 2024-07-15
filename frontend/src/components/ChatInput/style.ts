import { IconButton, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColorsEnum } from "../../common/theme";

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
  },
  "input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
  },
  padding: `${theme.spacing(1)} 0 ${theme.spacing(1)} ${theme.spacing(5)}`,
  borderRadius: theme.spacing(10),
  backgroundColor:
    theme.palette.mode === "dark" ? ColorsEnum.darkGrey : ColorsEnum.lightGrey,
  color: theme.palette.mode === "dark" ? ColorsEnum.white : ColorsEnum.black,
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "transparent",
  },
}));
