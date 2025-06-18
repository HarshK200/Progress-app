import { Circle } from "lucide-react";
import { useState } from "react";

export function Checkbox() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <Circle />
    </div>
  );
}
