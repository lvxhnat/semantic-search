import * as React from "react";
import * as S from "./style";
import Logo from "../../assets/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Toolbar, Typography } from "@mui/material";
import { ROUTES } from "../../common/constants";
import { useNavigate } from "react-router-dom";

interface HomeToolbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const HomeToolbar = (props: HomeToolbarProps) => {
  const navigate = useNavigate();
  const handleDrawerOpen = () => props.setOpen(true);
  const [gpuUsage, setGpuUsage] = React.useState("Loading...");

  React.useEffect(() => {
    const ws = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL!}/ws/gpu-usage`
    );

    ws.onmessage = (event) => {
      setGpuUsage(event.data); // Update the state with new data from WebSocket
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup WebSocket connection when component unmounts
    return () => {
      ws.close();
    };
  }, []);

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
        <S.LogoWrapper onClick={() => navigate(ROUTES.HOME)}>
          <img src={Logo} alt="" width="50px" />
          <Typography variant="h6" noWrap component="div">
            DbGPT
          </Typography>
        </S.LogoWrapper>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2">
            <b>GPU Memory Usage:</b> &nbsp;
            {gpuUsage.replace(", ", "/")}
          </Typography>
        </div>
      </Toolbar>
    </S.AppBar>
  );
};
