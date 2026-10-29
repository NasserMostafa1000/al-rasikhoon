import { useCallback, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AskAI from "./components/AskAI";
import Layout from "./components/Layout";
import Splash from "./components/Splash";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Tower from "./pages/Tower";

export default function App() {
  const [ready, setReady] = useState(() => sessionStorage.getItem("rasikhoon-splash") === "1");
  const onSplashDone = useCallback(() => {
    sessionStorage.setItem("rasikhoon-splash", "1");
    setReady(true);
  }, []);

  return (
    <>
      {!ready ? <Splash onDone={onSplashDone} /> : null}
      {ready ? (
        <>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tower" element={<Tower />} />
              <Route path="team" element={<Team />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <AskAI />
        </>
      ) : null}
    </>
  );
}
