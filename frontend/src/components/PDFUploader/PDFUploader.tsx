import React, { useState, useRef } from "react";
import * as S from "./style";
import { Button, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { ColorsEnum } from "../../common/theme";

interface PDFUploaderProps {
  setFiles: (files: File[]) => void;
}
export default function PDFUploader(props: PDFUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];

    if (f) {
      const isPDF =
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      if (isPDF) props.setFiles([f]);
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
      startIcon={<AttachFileIcon fontSize="small" />}
      onClick={handleOpenFileDialog}
      disableRipple
    >
      <input
        ref={fileInputRef}
        hidden
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <Typography variant="subtitle2">Attach</Typography>
    </S.AttachFileButton>
  );
}
