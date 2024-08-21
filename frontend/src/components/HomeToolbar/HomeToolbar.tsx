import * as React from "react";
import * as S from "./style";
import Logo from "../../assets/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Toolbar, Typography } from "@mui/material";

interface HomeToolbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const HomeToolbar = (props: HomeToolbarProps) => {
  const handleDrawerOpen = () => props.setOpen(true);

  return (
    <S.AppBar position="fixed" open={props.open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(props.open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <S.LogoWrapper>
          <img src={Logo} alt="" width="50px" />
          <Typography variant="h6" noWrap component="div">
            DbGPT
          </Typography>
        </S.LogoWrapper>
      </Toolbar>
    </S.AppBar>
  );
};
