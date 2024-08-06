import { styled } from "@mui/material/styles";
import { TableRow } from "@mui/material";

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    }
}));
