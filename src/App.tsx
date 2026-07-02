import "./index.css";
import "./App.css";
import "./resources.css";
import { AuthProvider } from "./auth/AuthProvider";
import AppRouter from "./routes/AppRouter";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
