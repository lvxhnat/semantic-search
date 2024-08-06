import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Drawer, Typography } from "@mui/material";
import { ColorsEnum } from "../../common/theme";

export const drawerWidth = 300;

export const LogoWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 5,
  alignItems: "center",
}));

export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
}));

export const FooterTypography = styled(Typography)(({ theme }) => ({
  paddingTop: 2,
  paddingBottom: 2,
  textAlign: "center",
}));

export const ChatWrapper = styled("div")(({ theme }) => ({
  height: "100%",
  overflowY: "auto",
  "::-webkit-scrollbar": {
    display: "none",
  },
}));

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflowY: "hidden",
  padding: `${theme.spacing(1)} ${theme.spacing(10)}`,
  paddingBottom: 0,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  boxShadow: "none",
  backgroundColor: "transparent",
  color: theme.palette.mode === "dark" ? ColorsEnum.white : ColorsEnum.black,
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
  },
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const LeftDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  width: "50%",
  justifyContent: "flex-start"
}));

export const RightDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  width: "50%",
  justifyContent: "flex-end"
}));