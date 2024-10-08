import * as React from "react";
import * as S from "./style";
import SendIcon from "@mui/icons-material/Send";
import {
  CircularProgress,
  InputAdornment,
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
  handleSubmit: (val: any) => void;
  handleCancel: () => void;
  loading?: boolean;
}

export default function ChatInput(props: ChatInputProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [value, setValue] = React.useState<string>("");

  const maxFiles = 3;

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

  const handleFileUpload = () => (acceptedFiles: File[]) => {
    setLoading(true);
    let newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    const formData = new FormData();
    newFiles.forEach((file: File) => formData.append("files", file));
    formData.append("conversation_id", props.conversationId); // Add conversation id
    request()
      .post(ENDPOINTS.UPLOAD_FILE, formData)
      .then((res) => setLoading(false))
      .catch((err) => console.error(err));
  };

  const onDrop = React.useCallback(handleFileUpload, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "application/pdf": [],
    },
  });

  return (
    <S.ChatInputBox
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
                <CircularProgress size="20px" color="inherit" />
              ) : files.length === 0 ? (
                <PDFUploader handleFileUpload={handleFileUpload} />
              ) : (
                <Tooltip
                  title={`${files.length} files uploaded. You can upload ${
                    maxFiles - files.length
                  } more files.`}
                  style={{ color: ColorsEnum.amethyst, display: "flex" }}
                >
                  <InsertDriveFileIcon fontSize="inherit" color="inherit" />
                </Tooltip>
              )}
              <MetaFocus />
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
