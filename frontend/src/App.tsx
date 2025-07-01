import { useMountUnmountKeybinds } from "@/hooks/useMountUnmountKeybinds";
import BoardPage from "@/pages/BoardPage";
import { useHydrateUserDataState } from "@/hooks/useHydrateUserData";
import Sidebar from "./components/Sidebar";
import { useBoardOpenIdValue } from "./store";

const App = () => {
  // handles Keybinds mounting on component load, and unmount on unload.
  useMountUnmountKeybinds();
  useHydrateUserDataState();

  const boardOpen = useBoardOpenIdValue();
  return (
    <div className="dark flex min-w-full min-h-screen bg-background text-foreground">
      <Sidebar />

      {/* TODO:  */}
      <BoardPage board_id={boardOpen} />
    </div>
  );
};

export default App;
