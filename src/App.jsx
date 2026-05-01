import { useEffect, useState } from "react";

import AppRoutes from "./routes/AppRoutes";
import { applyTheme, getInitialTheme } from "./utils/theme";

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return <AppRoutes theme={theme} onToggleTheme={handleToggleTheme} />;
}

export default App;
