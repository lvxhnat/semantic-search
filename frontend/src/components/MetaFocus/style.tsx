import { styled, alpha } from "@mui/material/styles";
import { Button, MenuItem, Typography } from "@mui/material";
import { ColorsEnum } from "../../common/theme";
import Menu, { MenuProps } from "@mui/material/Menu";

export const drawerWidth = 300;

export const StyledButton = styled(Button)(({ theme }) => ({
  color: ColorsEnum.coolgray2,
  textTransform: "none",
  padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
  borderRadius: theme.spacing(5),
  "&:hover": { backgroundColor: ColorsEnum.coolgray6 },
}));

export const StyledMenuItem = styled("div")(({ theme }) => ({
  "&:hover": { backgroundColor: "transparent" },
  display: "flex",
  alignItems: "flex-start",
  padding: 5,
  gap: 5
}));

interface StyledMenuItemContainerProps {
  selected: boolean
}

export const StyledMenuItemContainer = styled("div")<StyledMenuItemContainerProps>(({ theme, selected }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  width: "250px",
  backgroundColor: selected ? ColorsEnum.offWhite : "transparent",
  "&:hover": { backgroundColor: ColorsEnum.coolgray5, cursor: "pointer" }
}));

export const StyledMenuItemTitle = styled("div")(({ theme }) => ({
  gap: 5,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center"
}));

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "0px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));
