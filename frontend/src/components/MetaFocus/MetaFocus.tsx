import React from "react";
import * as S from "./style";
import { Button, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function MetaFocus() {
  const [file, setFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];

    if (f) {
      const isPDF =
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      if (isPDF) setFile(f);
      else setFile(null);
    }
  };

  const handleOpenFileDialog = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open the file dialog
    }
  };

  return (
    <S.AttachFileButton
      startIcon={<FilterListIcon fontSize="small" />}
      onClick={handleOpenFileDialog}
      disableRipple
    >
      <Typography variant="subtitle2">Focus</Typography>
    </S.AttachFileButton>
  );
}
