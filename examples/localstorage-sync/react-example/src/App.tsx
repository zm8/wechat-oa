import "./App.css";
import Count from "./components/Count";

function App() {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Count />
      <Count />
    </div>
  );
}

export default App;
