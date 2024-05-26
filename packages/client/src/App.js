import ToggleColorMode from "./components/ToggleColorMode";
import Views from "./components/Views";
import UserContext from "./components/AccountContext";
import socket from "./socket";

function App() {
  socket.connect();
  return (
    <UserContext>
      <Views />
      <ToggleColorMode />
    </UserContext>
  );
}

export default App;