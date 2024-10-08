import React from "react";
import * as S from "./style";
import { MenuItem, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function MetaFocus() {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent event bubbling
    setAnchorEl(event.currentTarget);
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open the file dialog
    }
  };

  return (
    <React.Fragment>
      <S.StyledButton
        startIcon={<FilterListIcon fontSize="small" />}
        onClick={handleClick}
        disableRipple
      >
        <Typography variant="subtitle2">Focus</Typography>
      </S.StyledButton>
      <S.StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Duplicate
        </MenuItem>
      </S.StyledMenu>
    </React.Fragment>
  );
}
