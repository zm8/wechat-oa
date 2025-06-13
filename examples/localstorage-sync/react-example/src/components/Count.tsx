import { useSyncedLocalStorage } from "../hooks/useSyncedLocalStorage";

export default function Number() {
  const { value, setValue } = useSyncedLocalStorage("a", 0);
  const increace = () => {
    setValue(value + 1);
  };

  return <button onClick={increace}>{value}</button>;
}
