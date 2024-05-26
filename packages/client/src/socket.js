import {io} from "socket.io-client"

const socket = new io("http://localhost:4000", {
  autoConnect: false, // we don't want the socket connects to the backend when the user is not loggged in
  withCredentials: true,
});

export default socket;