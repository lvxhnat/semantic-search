import * as React from "react";
import * as S from "./style";
import axios, { CancelTokenSource } from "axios";
import { v4 as uuid } from "uuid";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ChatInput from "../../components/ChatInput/ChatInput";
import ChatBox from "../../components/ChatBox";
import { ChatBoxType } from "../../components/ChatBox/ChatBox";
import { request } from "../../common/services/request";
import { Alert, Grid, Skeleton } from "@mui/material";
import { SEMANTIC_SEARCH_KEY } from "../../common/constants";
import ChatTable from "../../components/ChatTable";
import HomeToolbar from "../../components/HomeToolbar";
import Logo from "../../assets/logo.png";
import { ROUTES } from "../../common/constants";
import { useNavigate } from "react-router-dom";
import PDFViewer from "../../components/PDFViwer";

const defaultValue: ChatBoxType = {
  role: "system",
  content:
    "You are a helpful AI assistant that is answering questions from a database.",
  reference_ids: {},
};

export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string>("");
  const [availableChats, setAvailableChats] = React.useState<any[]>([]);
  const [selectedUuid, setSelectedUuid] = React.useState<string>(uuid());
  const [textHistory, setTextHistory] = React.useState<ChatBoxType[]>([
    defaultValue,
  ]);
  const [cancelTokenSource, setCancelTokenSource] =
    React.useState<CancelTokenSource | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | undefined>();

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
          }),
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

    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [textHistory]);

  const handleOpenExistingChat = (entry: any) => {
    const conversationId = entry.uuid;
    const data = JSON.parse(localStorage.getItem(SEMANTIC_SEARCH_KEY)!);
    setSelectedUuid(conversationId);
    setTextHistory(data[conversationId].chatHistory);
    setFile(undefined);
    request()
      .get(`upload/pdf/${conversationId}`, { responseType: "blob" })
      .then((response) => {
        const contentDisposition = response.headers["content-disposition"];
        let fileName = "download.pdf";
        if (contentDisposition) {
          const matches = /filename="([^"]+)"/.exec(contentDisposition);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }
        const file = new File([response.data], fileName, {
          type: "application/pdf",
        });
        setFile(file);
      })
      .catch((err) => setFile(undefined));
  };

  const handleOpenNewChat = () => {
    setError("");
    setLoading(false);
    setSelectedUuid(uuid()); // Create a new conversation id
    setFile(undefined); // Clear all existing files
    setTextHistory([defaultValue]);
  };

  return (
    <S.Container>
      <CssBaseline />
      <HomeToolbar open={open} setOpen={setOpen} />
      <S.StyledDrawer variant="persistent" anchor="left" open={open}>
        <S.DrawerHeader>
          <S.LogoWrapper onClick={() => navigate(ROUTES.HOME)}>
            <img src={Logo} alt="" width="50px" />
            <Typography variant="h6" noWrap component="div">
              DbGPT
            </Typography>
          </S.LogoWrapper>
          <S.RightDrawerHeader>
            <S.StyledIconButton onClick={() => setOpen(false)}>
              <FirstPageIcon />
            </S.StyledIconButton>
          </S.RightDrawerHeader>
        </S.DrawerHeader>
        <S.LeftDrawerHeader>
          <S.StyledButton
            variant="outlined"
            fullWidth
            onClick={handleOpenNewChat}
            endIcon={<OpenInNewIcon />}
          >
            New Thread
          </S.StyledButton>
        </S.LeftDrawerHeader>
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
              <ListItem key={entry.uuid} disablePadding>
                <ListItemButton onClick={() => handleOpenExistingChat(entry)}>
                  <Typography variant="subtitle2" noWrap>
                    {entry.text}
                  </Typography>
                </ListItemButton>
                <S.DeleteIconButton disableRipple>
                  <DeleteIcon color="inherit" fontSize="small" />
                </S.DeleteIconButton>
              </ListItem>
            );
          })}
        </List>
      </S.StyledDrawer>

      <S.Main open={open} isEmpty={textHistory.length < 2} gap={2}>
        {file && textHistory.length > 1 ? (
          <Grid
            item
            xs={5}
            sx={{
              overflowY: "hidden",
              width: "100%",
            }}
          >
            <PDFViewer file={file} />
          </Grid>
        ) : (
          <></>
        )}
        <S.GridItemWrapper item xs={textHistory.length < 2 ? 12 : 7}>
          <S.DrawerHeader />
          <S.ChatWrapper isEmpty={textHistory.length < 2} id="chat-wrapper">
            {textHistory
              .slice(1, textHistory.length)
              .map((entry: ChatBoxType, i) => {
                if (!entry.content) return 
                const text = entry.content
                  .replace(/(\s*\d+\.\s)/g, "\n$1")
                  .replaceAll("\n\n", "\n");
                if (i === textHistory.length - 1) {
                  return (
                    <ChatBox
                      key={`${entry.role}-${i}`}
                      user={entry.role}
                      ref={chatRef}
                    >
                      <S.StyledTypography>{text}</S.StyledTypography>
                    </ChatBox>
                  );
                } else
                  return (
                    <ChatBox key={`${entry.role}-${i}`} user={entry.role}>
                      <S.StyledTypography>{text}</S.StyledTypography>
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

          <S.ChatInputWrapper isEmpty={textHistory.length < 2}>
            {textHistory.length < 2 ? (
              <Typography variant="h4" align="center">
                Your Gateway to Understanding
              </Typography>
            ) : null}
            <ChatInput
              setFile={setFile}
              conversationId={selectedUuid}
              isNewConversation={textHistory.length < 2}
              loading={loading}
              handleCancel={() =>
                cancelTokenSource
                  ? cancelTokenSource.cancel("Operation canceled by user")
                  : null
              }
              handleSubmit={(entry) => {
                console.log(entry, "Entry")
                const { role, content, reference_ids } = entry;
                console.log(`Logging user role: ${role} on content ${content}`)
                const sanitizedEntry = { role, content, reference_ids: reference_ids || {} };
                
                const newTextHistory = [...textHistory, sanitizedEntry];
                const source = axios.CancelToken.source();
                setCancelTokenSource(source);
                setError("");
                setTextHistory(newTextHistory);
                setLoading(true);
                request()
                  .post(
                    "query",
                    { query: newTextHistory, conversationId: selectedUuid },
                    { cancelToken: source.token },
                  )
                  .then((res) => {
                    setTextHistory(res.data);
                    setLoading(false);
                  })
                  .catch((err) => {
                    setLoading(false);
                    if (axios.isCancel(err)) {
                      console.log(err);
                    } else {
                      setError(
                        `Exception encountered when running model: ${err.message}`,
                      );
                    }
                  });
              }}
            />
          </S.ChatInputWrapper>
        </S.GridItemWrapper>
      </S.Main>
    </S.Container>
  );
}
