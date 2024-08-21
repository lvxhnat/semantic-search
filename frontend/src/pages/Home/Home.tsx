import * as React from "react";
import * as S from "./style";
import axios, { CancelTokenSource } from 'axios';
import { v4 as uuid } from "uuid";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChatInput from "../../components/ChatInput/ChatInput";
import ChatBox from "../../components/ChatBox";
import { ChatBoxType } from "../../components/ChatBox/ChatBox";
import { request } from "../../common/services/request";
import { Alert, Skeleton } from "@mui/material";
import { SEMANTIC_SEARCH_KEY } from "../../common/constants";
import ChatTable from "../../components/ChatTable";
import HomeToolbar from "../../components/HomeToolbar";

const defaultValue: ChatBoxType = {
  role: "system",
  content:
    "You are a helpful AI assistant that is answering questions from a database.",
  reference_ids: {},
};


export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string>("");
  const [availableChats, setAvailableChats] = React.useState<any[]>([]);
  const [selectedUuid, setSelectedUuid] = React.useState<string>(uuid());
  const [textHistory, setTextHistory] = React.useState<ChatBoxType[]>([
    defaultValue,
  ]);
  const [cancelTokenSource, setCancelTokenSource] = React.useState<CancelTokenSource | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Text history more than 1 so we do not save chats that have been initialised but not spoken to.
    const obj = localStorage.getItem(SEMANTIC_SEARCH_KEY);
    if (textHistory.length >= 2) {
      if (!obj) {
        localStorage.setItem(
          SEMANTIC_SEARCH_KEY,
          JSON.stringify({
            [selectedUuid]: {
              chatHistory: textHistory,
              lastUpdated: new Date(),
            },
          })
        );
      } else {
        const json = JSON.parse(obj!);
        json[selectedUuid] = {
          chatHistory: textHistory,
          lastUpdated: new Date(),
        };
        localStorage.setItem(SEMANTIC_SEARCH_KEY, JSON.stringify(json));
      }
    }
    // This is the object that retrieves the side bar
    if (obj) {
      const json = JSON.parse(obj!);
      const chatView = Object.keys(json).map((col) => {
        const chatHistory = json[col].chatHistory;
        const jsonItem = chatHistory[chatHistory.length - 1];
        return {
          uuid: col,
          text:
            jsonItem && jsonItem.content ? jsonItem.content : "Current Chat",
          lastUpdated: json[col].lastUpdated,
        };
      });
      setAvailableChats(chatView);
    }
  }, [textHistory]);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenNewChat = () => {
    setError("");
    setLoading(false);
    setSelectedUuid(uuid());
    setTextHistory([defaultValue]);
  };

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [textHistory]);

  return (
    <S.Container>
      <CssBaseline />
      <HomeToolbar open={open} setOpen={setOpen} />
      <S.StyledDrawer variant="persistent" anchor="left" open={open}>
        <S.DrawerHeader>
          <S.LeftDrawerHeader>
            <IconButton onClick={handleOpenNewChat}>
              <OpenInNewIcon />
            </IconButton>
          </S.LeftDrawerHeader>
          <S.RightDrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </S.RightDrawerHeader>
        </S.DrawerHeader>
        <Divider />
        <List>
          <ListItem>
            <Typography variant="subtitle1" color="grey">
              {" "}
              Chat History{" "}
            </Typography>
          </ListItem>
          {availableChats.map((entry) => {
            return (
              <ListItem
                key={entry.uuid}
                disablePadding
                onClick={() => {
                  const data = JSON.parse(
                    localStorage.getItem(SEMANTIC_SEARCH_KEY)!
                  );
                  setSelectedUuid(entry.uuid);
                  setTextHistory(data[entry.uuid].chatHistory);
                }}
              >
                <ListItemButton>
                  <Typography variant="subtitle2" noWrap>
                    {entry.text}
                  </Typography>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </S.StyledDrawer>
      <S.Main open={open}>
        <S.DrawerHeader />
        <S.ChatWrapper>
          {textHistory
            .slice(1, textHistory.length)
            .map((entry: ChatBoxType, i) => {
              const text = entry.content.replace(/(\s*\d+\.\s)/g, '\n$1').replaceAll("\n\n", "\n");
              if (i === textHistory.length - 1) {
                return (
                  <ChatBox
                    key={`${entry.role}-${i}`}
                    user={entry.role}
                    ref={chatRef}
                  >
                    <Typography  style={{whiteSpace: 'pre-line'}}>
                    {text}
                    </Typography>
                  </ChatBox>
                );
              } else
                return (
                  <ChatBox key={`${entry.role}-${i}`} user={entry.role}>
                    <Typography align="left" style={{whiteSpace: 'pre-line'}}>{text}</Typography>
                    {entry.reference_ids &&
                    Object.keys(entry.reference_ids).length > 0 ? (
                      <div style={{ width: "100%" }}>
                        <Typography paragraph>
                          Here are some relevant entries in the database:
                        </Typography>
                        <ChatTable referenceIds={entry.reference_ids} />
                      </div>
                    ) : null}
                  </ChatBox>
                );
            })}
          {error !== "" ? (
            <Alert severity="error">{error}</Alert>
          ) : loading ? (
            <ChatBox user={"system"}>
              <Skeleton
                sx={{ bgcolor: "grey.800", marginTop: 0.5 }}
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
          handleCancel={() => (cancelTokenSource) ? cancelTokenSource.cancel('Operation canceled by user') : null}
          handleSubmit={(entry) => {
            const newTextHistory = [...textHistory, entry];
            const source = axios.CancelToken.source()
            setCancelTokenSource(source)
            setError("");
            setTextHistory(newTextHistory);
            setLoading(true);
            request()
              .post("query", { query: newTextHistory }, { cancelToken: source.token })
              .then((res) => {
                setTextHistory(res.data);
                setLoading(false);
              })
              .catch((err) => {
                setLoading(false);
                if (axios.isCancel(err)) { console.log(err) }
                else {
                  setError(
                    `Exception encountered when running model: ${err.message}`
                  );
                }
              })
          }}
        />
        <S.FooterTypography variant="subtitle2">
          DbGPT can sometime make mistakes. Check important info.
        </S.FooterTypography>
      </S.Main>
    </S.Container>
  );
}
