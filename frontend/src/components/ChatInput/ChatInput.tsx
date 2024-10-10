import * as React from "react";
import * as S from "./style";
import SendIcon from "@mui/icons-material/Send";
import {
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { typographyTheme } from "../../common/theme/typography";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PDFUploader from "../PDFUploader";
import MetaFocus from "../MetaFocus";
import { useDropzone } from "react-dropzone";
import { ColorsEnum } from "../../common/theme";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { removeLineBreaks } from "../../common/utils/formatting";
import { request } from "../../common/services/request";
import { ENDPOINTS } from "../../common/constants";

interface ChatInputProps {
  conversationId: string;
  isNewConversation: boolean;
  handleSubmit: (val: any) => void;
  handleCancel: () => void;
  setFile: (f: File | undefined) => void;
  loading?: boolean;
}

export default function ChatInput(props: ChatInputProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File>();
  const [value, setValue] = React.useState<string>("");
  const maxFiles = 3;

  React.useEffect(() => {
    setFile(undefined)
  }, [props.conversationId])
  

  const handleSubmit = () => {
    if (!(value.trim() === "")) {
      const entry = {
        role: "user",
        content: value,
      };
      props.handleSubmit(entry);
      setValue("");
    }
  };

  const handleFileUpload = (acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0]
    setLoading(true);
    setFile(acceptedFile);
    props.setFile(acceptedFile)
    const formData = new FormData();
    formData.append("files", acceptedFile)
    formData.append("conversation_id", props.conversationId); // Add conversation id
    request()
      .post(ENDPOINTS.UPLOAD_FILE, formData)
      .then((res) => setLoading(false))
      .catch((err) => console.error(err));
  };

  const onDrop = React.useCallback(handleFileUpload, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [],
    },
  });

  return (
    <S.ChatInputBox
      id="chat-input-box"
      {...getRootProps({
        onClick: (event) => event.stopPropagation(),
        isDragActive: isDragActive,
      })}
    >
      {isDragActive ? (
        <S.DropBox>
          <PictureAsPdfIcon color="inherit" />
          <Typography variant="subtitle1" color="inherit">
            Drop your files here
          </Typography>
        </S.DropBox>
      ) : (
        <React.Fragment>
          <S.StyledTextField
            disabled={loading}
            multiline
            variant="standard"
            autoComplete="off"
            type="text"
            placeholder="Ask me a question to begin"
            InputProps={{
              disableUnderline: true,
            }}
            inputProps={{
              style: { fontSize: typographyTheme.body1.fontSize },
            }}
            InputLabelProps={{
              style: { fontSize: typographyTheme.body1.fontSize },
            }}
            value={removeLineBreaks(value) ?? ""}
            onChange={(event) => setValue(event.target.value ?? "")}
            onKeyDown={(e) => (e.keyCode === 13 ? handleSubmit() : null)}
          />
          <S.FunctionalityWrapper>
            <S.MetaFunctionalityWrapper>
              {loading ? (
                <S.FileUploaded>
                  <CircularProgress size="20px" color="inherit" />
                  <Typography variant="subtitle2">Uploading...</Typography>
                </S.FileUploaded>
              ) : !file ? (
                <PDFUploader handleFileUpload={handleFileUpload} />
              ) : (
                <S.FileUploaded>
                  <Tooltip
                    title={"File files uploaded."}
                    style={{ color: ColorsEnum.amethyst, display: "flex" }}
                  >
                    <InsertDriveFileIcon fontSize="inherit" color="inherit" />
                  </Tooltip>
                  <Typography variant="subtitle2" color="inherit" noWrap>{file.name}</Typography>
                </S.FileUploaded>
              )}
              <MetaFocus isNewConversation={props.isNewConversation}/>
            </S.MetaFunctionalityWrapper>
            <S.StyledIconButton
              disabled={value === "" && !props.loading}
              disableFocusRipple
              onClick={props.loading ? props.handleCancel : props.handleSubmit}
            >
              {props.loading ? <StopCircleIcon /> : <SendIcon />}
            </S.StyledIconButton>
          </S.FunctionalityWrapper>
        </React.Fragment>
      )}
    </S.ChatInputBox>
  );
}
