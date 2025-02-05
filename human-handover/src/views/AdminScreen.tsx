import { ApiStatus } from '@/components/plugin/types';
import { Button } from '@/components/ui/button.tsx';
import { useLocalStorage } from '@uidotdev/usehooks';
import { LocalStorageItem } from "@/utils/localStorage.ts";

function AdminScreen() {
  const [humanHandover, setHumanHandover] = useLocalStorage(LocalStorageItem.HumanHandover, false);
  const [controllerApiStatus] = useLocalStorage<ApiStatus | null>(LocalStorageItem.ControllerApiStatus, null);

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col gap-2">
        <p>AdminScreen - humanHandover: {humanHandover.toString()}</p>
        <Button onClick={() => setHumanHandover(!humanHandover)}>Toggle Handover</Button>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col gap-2">
        <p>AdminScreen - controllerApiStatus</p>
        <pre>{JSON.stringify(controllerApiStatus, null, 2)}</pre>
      </div>
    </div>
  );
}

export default AdminScreen;
