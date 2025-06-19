import Sidebar from "./components/Sidebar";
import { mountUnmoutKeybinds } from "./lib/utils";
import BoardPage from "./pages/Board";

function App() {
  // Keybinds mounting on component load an unmount on unload
  mountUnmoutKeybinds();

  return (
    <div className="dark min-w-full min-h-screen bg-background text-foreground flex">
      <Sidebar />

      {/* TODO: use react router here i.e. <Routes></Routes>*/}
      <BoardPage boardId="251ab92d-ccff-4e74-ae4e-619ebb3b1752" />
    </div>
  );
}

export default App;
