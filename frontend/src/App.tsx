import { useMountUnmountKeybinds } from "@/hooks/useMountUnmountKeybinds";
import BoardPage from "@/pages/BoardPage";
import { useHydrateUserDataState } from "@/hooks/useHydrateUserData";
import Sidebar from "./components/Sidebar";
import { useBoardLastOpenIdValue } from "./store";
import { Toaster } from "react-hot-toast";

const App = () => {
  // handles Keybinds mounting on component load, and unmount on unload.
  useMountUnmountKeybinds();
  useHydrateUserDataState();

  const boardOpen = useBoardLastOpenIdValue();
  return (
    <div className="dark flex min-w-full min-h-screen bg-background text-foreground">
      <Sidebar />

      <BoardPage board_id={boardOpen} />
      <Toaster />
    </div>
  );
};

export default App;
