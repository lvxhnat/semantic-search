import * as React from "react";
import * as S from "./style";

import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ChatInput from "../../components/ChatInput/ChatInput";
import ChatBox from "../../components/ChatBox";
import { ChatBoxType } from "../../components/ChatBox/ChatBox";
import { request } from "../../common/services/request";

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [textHistory, setTextHistory] = React.useState<ChatBoxType[]>([])
  const [chatPrompt, setChatPrompt] = React.useState<string>("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <CssBaseline />
      <S.AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            DbGPT
          </Typography>
        </Toolbar>
      </S.AppBar>
      <S.StyledDrawer variant="persistent" anchor="left" open={open}>
        <S.DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </S.DrawerHeader>
        <Divider />
        <List>
          {["Inbox", "Starred"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </S.StyledDrawer>
      <S.Main open={open}>
        <S.DrawerHeader />
        <S.ChatWrapper>
          {
            textHistory.map((entry) => <ChatBox user={entry.role}>
              {entry.content}
            </ChatBox>)
          }
        </S.ChatWrapper>
        <S.ChatInputWrapper>
          <ChatInput handleSubmit={(entry) => {
            const newTextHistory = [...textHistory, entry]
            setTextHistory(newTextHistory);
            request().post("query", { query: newTextHistory }).then((res) => console.log(res.data))
          }}/>
          <Typography variant="subtitle1" align="center" sx={{ paddingTop: 1, paddingBottom: 1 }}>
            DbGPT can something make mistakes. Check important info.
          </Typography>
        </S.ChatInputWrapper>
      </S.Main>
    </div>
  );
}
