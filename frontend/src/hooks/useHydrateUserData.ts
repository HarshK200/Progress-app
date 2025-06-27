import { GetUserData } from "@wailsjs/go/main/App";
import { useSetDataState } from "@/store";

export function useHydrateUserDataState() {
  const setDataState = useSetDataState();
  GetUserData().then((data) => setDataState(data.user_data));
}
