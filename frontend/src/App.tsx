import Sidebar from "./components/Sidebar";
import { mountUnmoutKeybinds } from "./lib/utils";

function App() {
  // Keybinds mounting on component load an unmount on unload
  mountUnmoutKeybinds();

  return (
    // TODO: wrap in jotai state Provider
    <div className="dark min-h-screen bg-background text-foreground flex">
      <Sidebar />

      {/* TODO: use react router here i.e. <Routes></Routes>*/}
      <main className="text-white px-10 py-8">
        <h1 className="text-xl font-bold">Body content</h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
      </main>
    </div>
  );
}

export default App;
