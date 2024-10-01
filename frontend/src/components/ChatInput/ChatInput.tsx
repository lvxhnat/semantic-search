import * as React from "react";
import * as S from "./style";
import SendIcon from "@mui/icons-material/Send";
import { InputAdornment, Tooltip, Typography } from "@mui/material";
import { typographyTheme } from "../../common/theme/typography";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PDFUploader from "../PDFUploader";
import MetaFocus from "../MetaFocus";
import { useDropzone } from "react-dropzone";
import { ColorsEnum } from "../../common/theme";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface ChatInputProps {
  handleSubmit: (val: any) => void;
  handleCancel: () => void;
  loading?: boolean;
}

export default function ChatInput(props: ChatInputProps) {
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

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (files.length < maxFiles) {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
            InputProps={{
              disableUnderline: true,
            }}
            inputProps={{
              style: { fontSize: typographyTheme.body1.fontSize },
            }}
            InputLabelProps={{
              style: { fontSize: typographyTheme.body1.fontSize },
            }} // font size of input label
            value={value ?? ""}
            onChange={(event) => {
              setValue(event.target.value ?? "");
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) handleSubmit();
            }}
          />
          <S.FunctionalityWrapper>
            <S.MetaFunctionalityWrapper>
              {files.length === 0 ? (
                <PDFUploader setFiles={setFiles} />
              ) : (
                <Tooltip
                  title={`${files.length} files uploaded. You can upload ${
                    maxFiles - files.length
                  } more files.`}
                  style={{ color: ColorsEnum.amethyst, display: "flex" }}
                >
                  <InsertDriveFileIcon fontSize="small" color="inherit" />
                </Tooltip>
              )}
              <MetaFocus />
            </S.MetaFunctionalityWrapper>
            <S.StyledIconButton
              disabled={value === "" && !props.loading}
              disableFocusRipple
              onClick={props.loading ? props.handleCancel : props.handleSubmit}
            >
              <InputAdornment position="start">
                {props.loading ? <StopCircleIcon /> : <SendIcon />}
              </InputAdornment>
            </S.StyledIconButton>
          </S.FunctionalityWrapper>
        </React.Fragment>
      )}
    </S.ChatInputBox>
  );
}
