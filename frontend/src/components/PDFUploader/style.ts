import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { ColorsEnum } from "../../common/theme";

export const drawerWidth = 300;

export const StyledButton = styled(Button)(({ theme }) => ({
  color: ColorsEnum.coolgray2,
  textTransform: "none",
  padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
  borderRadius: theme.spacing(5),
  "&:hover": { backgroundColor: ColorsEnum.coolgray6 },
}));
