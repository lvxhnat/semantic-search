import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { ColorsEnum } from "../../common/theme";

export const drawerWidth = 300;

export const AttachFileButton = styled(Button)(({ theme }) => ({
  "&:hover": { backgroundColor: "transparent" },
  color: ColorsEnum.coolgray2,
  textTransform: "none",
  padding: theme.spacing(1.5),
}));
