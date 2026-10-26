import { Route, Routes } from 'react-router-dom'
import DevlogArticle from './routes/DevlogArticle.jsx'
import Devlogs from './routes/Devlogs.jsx'
import Home from './routes/Home.jsx'
import NotFound from './routes/NotFound.jsx'
import Projects from './routes/Projects.jsx'
import Studio from './routes/Studio.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/devlogs" element={<Devlogs />} />
      <Route path="/devlogs/:slug" element={<DevlogArticle />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
