import { styled } from "@mui/material/styles";
import { Button, Drawer, Grid, IconButton, Typography } from "@mui/material";
import { ColorsEnum } from "../../common/theme";

interface DefaultProps {
  isEmpty?: boolean;
}

export const drawerWidth = 300;

export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
}));

interface ChatInputWrapperProps extends DefaultProps {}

export const ChatInputWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isEmpty",
})<ChatInputWrapperProps>(({ theme, isEmpty }) => ({
  marginBottom: isEmpty ? theme.spacing(15) : theme.spacing(2),
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

interface ChatWrapperProps extends DefaultProps {}

export const ChatWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isEmpty",
})<ChatWrapperProps>(({ theme, isEmpty }) => ({
  gap: 20,
  display: isEmpty ? "none" : "flex",
  flexDirection: "column",
  height: "100%",
  maxWidth: "1200px",
  overflowY: "auto",
  "::-webkit-scrollbar": {
    display: "none",
  },
}));

interface MainProps extends DefaultProps {
  open?: boolean;
}

export const Main = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "isEmpty" && prop !== "open",
})<MainProps>(({ theme, open, isEmpty }) => ({
  flexGrow: 1,
  height: "100%",
  display: "flex",
  overflowY: "hidden",
  padding: `${theme.spacing(1)} ${isEmpty ? theme.spacing(30) : theme.spacing(10)}`,
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

export const GridItemWrapper = styled(Grid)(({ theme }) => ({
  width: "100%",
  display: "flex",
  overflowY: "hidden",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(1),
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

export const LogoWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 5,
  alignItems: "center",
  "&:hover": {
    cursor: "pointer",
  },
}));

export const LeftDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  justifyContent: "flex-start",
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  paddingTop: 0,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  color: ColorsEnum.darkGrey,
  textTransform: "none",
  outline: `1px solid ${ColorsEnum.darkGrey}`,
  border: "none",
  borderRadius: "20px",
  "&:hover": {
    color: ColorsEnum.black,
    border: "none",
    outline: `2px solid ${ColorsEnum.coolgray3}`,
  },
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export const RightDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  width: "50%",
  justifyContent: "flex-end",
}));

export const DeleteIconButton = styled(Button)(({ theme }) => ({
  padding: 0,
  "&:hover": {
    backgroundColor: "transparent",
    color: ColorsEnum.darkGrey,
  },
  color: ColorsEnum.grey,
  background: "transparent",
  minHeight: 0,
  minWidth: 40,
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  display: "inline-block",
  whiteSpace: "pre-line",
  wordBreak: "break-word",
}));
