import { styled } from "@mui/material/styles";
import { Paper, TableContainer, TableRow } from "@mui/material";

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
        color: "#0000EE",
    },
    color: "black",
}));

export const StyledTableContainer = styled(Paper)(({ theme }) => ({
    "&:-webkit-scrollbar": {
        display: "none",
    },
    width: "100%",
    overflow: "hidden",
}));
