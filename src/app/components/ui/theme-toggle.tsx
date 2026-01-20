import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "../theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="border-border bg-card hover:bg-accent"
    >
      {/* 
        If theme is light, show Sun (Current State). 
        If user wants 'Switch To' logic, swap these. 
        User complained 'Light state... moon', which implies mismatch.
        Ensuring ThemeProvider syncs class correctly should fix the mismatch.
      */}
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-foreground" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-foreground" />
      )}
      <span className="sr-only">테마 전환</span>
    </Button>
  );
}
