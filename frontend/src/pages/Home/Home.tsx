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
import Logo from "../../assets/logo.png";
import { Skeleton } from "@mui/material";

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const [textHistory, setTextHistory] = React.useState<ChatBoxType[]>([
    {
      role: "system",
      content:
        "You are a helpful AI assistant that is answering questions from a database.",
    },
  ]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [textHistory]);

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
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <img src={Logo} alt="" width="50px" />
            <Typography variant="h6" noWrap component="div">
              DbGPT
            </Typography>
          </div>
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
          {textHistory.slice(1, textHistory.length).map((entry, i) => {
            if (i === textHistory.length - 1)
              return (
                <ChatBox
                  key={`${entry.role}-${i}`}
                  user={entry.role}
                  ref={chatRef}
                >
                  {entry.content}
                </ChatBox>
              );
            else
              return (
                <ChatBox key={`${entry.role}-${i}`} user={entry.role}>
                  {entry.content}
                </ChatBox>
              );
          })}
          {loading ? (
            <ChatBox user={"system"}>
              <div style={{ paddingTop: "21px" }} />
              <Skeleton
                sx={{ bgcolor: "grey.800" }}
                variant="circular"
                width="15px"
                height="15px"
              />
            </ChatBox>
          ) : null}
          <div ref={chatRef}></div>
        </S.ChatWrapper>
        <ChatInput
          loading={loading}
          handleSubmit={(entry) => {
            const newTextHistory = [...textHistory, entry];
            setTextHistory(newTextHistory);
            setLoading(true);
            request()
              .post("query", { query: newTextHistory })
              .then((res) => {
                setTextHistory(res.data);
                setLoading(false);
              });
          }}
        />
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ paddingTop: 1, paddingBottom: 1 }}
        >
          DbGPT can something make mistakes. Check important info.
        </Typography>
      </S.Main>
    </div>
  );
}
