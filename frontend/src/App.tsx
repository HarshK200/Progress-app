import { useMountUnmountKeybinds } from "@/hooks/useMountUnmountKeybinds";
import BoardPage from "@/pages/BoardPage";
import { useHydrateUserDataState } from "@/hooks/useHydrateUserData";
import Sidebar from "./components/Sidebar";

function App() {
  // handles Keybinds mounting on component load, and unmount on unload.
  useMountUnmountKeybinds();
  useHydrateUserDataState();

  return (
    <div className="dark min-w-full min-h-screen bg-background text-foreground ">
      <BoardPage boardId="251ab92d-ccff-4e74-ae4e-619ebb3b1752" />
    </div>
  );
}

export default App;
