import Sidebar from "./components/Sidebar";
import { mountUnmoutKeybinds } from "./lib/utils";
import BoardPage from "./pages/Board";

function App() {
  // Keybinds mounting on component load an unmount on unload
  mountUnmoutKeybinds();

  return (
    // TODO: wrap in jotai state Provider
    <div className="dark min-h-screen bg-background text-foreground flex">
      <Sidebar />

      {/* TODO: use react router here i.e. <Routes></Routes>*/}
      <BoardPage />
    </div>
  );
}

export default App;
