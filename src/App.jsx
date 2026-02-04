import Navbar from "./components/Navbar"
import Home from "./components/Home"
import About from "./components/About"
import Projects from "./components/Projects"
import Contact from "./components/Contact"


export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Home />
      <About />
      {/* <Projects /> */}
      <Contact />
    </div>
  )
}