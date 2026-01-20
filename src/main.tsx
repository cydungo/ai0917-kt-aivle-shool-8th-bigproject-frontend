import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 추가
import App from "./app/App";
import "./styles/index.css";
import { ThemeProvider } from "./app/components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
