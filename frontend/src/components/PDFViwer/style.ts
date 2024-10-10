import { styled } from "@mui/material/styles";

export const PDFViewerWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));
