import * as React from "react";
import * as S from "./style";
import SendIcon from "@mui/icons-material/Send";
import { InputAdornment } from "@mui/material";
import { typographyTheme } from "../../common/theme/typography";
import StopCircleIcon from "@mui/icons-material/StopCircle";

interface ChatInputProps {
  handleSubmit: (val: any) => void;
  handleCancel: () => void;
  loading?: boolean;
}

export default function ChatInput(props: ChatInputProps) {
  const [value, setValue] = React.useState<string>("");

  const handleSubmit = () => {
    const entry = {
      role: "user",
      content: value,
    };
    props.handleSubmit(entry);
    setValue("");
  };

  return (
    <S.StyledTextField
      variant="standard"
      autoComplete="off"
      type="text"
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <S.StyledIconButton disableFocusRipple onClick={handleSubmit}>
            <InputAdornment position="start">
              {props.loading ? (
                <StopCircleIcon onClick={props.handleCancel} />
              ) : (
                <SendIcon />
              )}
            </InputAdornment>
          </S.StyledIconButton>
        ),
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
  );
}
