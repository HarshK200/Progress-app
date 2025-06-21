import { useEffect, useState } from "react";
import { GetUserData, Greet } from "@wailsjs/go/main/App";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";

function App() {
  const [result, setResult] = useState("");

  useEffect(() => {
    Greet("Ballz").then((res) => setResult(res));

    GetUserData().then((response) => {
      const userData = response.user_data;
      console.log(userData);
    });
  }, []);

  return (
    <div className="dark min-w-full min-h-screen bg-background text-foreground ">
      <h1>Result: {result}</h1>
      <div>
        <TextareaAutoresize title="testing" outlineOnClick={false} outlineOnDoubleClick/>
      </div>
    </div>
  );
}

export default App;
