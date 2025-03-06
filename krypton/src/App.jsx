import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Install from "./components/Install";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  if (window.ethereum) {
    return <Home />;
  } else {
    return <Install />;
  }
}

export default App;
