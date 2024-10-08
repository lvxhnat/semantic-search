import * as React from "react";
import * as S from "./style";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Toolbar, Typography } from "@mui/material";

interface HomeToolbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface GPUData {
  id: string;
  usage: string;
  capacity: string;
}

export const HomeToolbar = (props: HomeToolbarProps) => {
  const handleDrawerOpen = () => props.setOpen(true);
  const [gpuUsage, setGpuUsage] = React.useState<GPUData>({} as GPUData);

  React.useEffect(() => {
    const ws = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL!}/ws/gpu-usage`,
    );

    ws.onmessage = (event) => {
      setGpuUsage(JSON.parse(event.data)); // Update the state with new data from WebSocket
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
          sx={{
            mr: 2,
            ...(props.open && { display: "none" }),
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <MenuIcon />
        </IconButton>
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
            {gpuUsage.usage
              ? `${((100 * +gpuUsage.usage) / +gpuUsage.capacity).toFixed(2)}%`
              : null}
          </Typography>
        </div>
      </Toolbar>
    </S.AppBar>
  );
};
