import App from "./App";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./providers";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

function ThemedApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

root.render(<ThemedApp />);
