import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import MolecularGeneration from './pages/MolecularGeneration'
import KnowledgeBase from './pages/KnowledgeBase'
import Testing from './pages/Testing'
import GraphDiscovery from './pages/GraphDiscovery'
import DrugDesign from './pages/DrugDesign'
import Settings from './pages/Settings'

// Context Providers
import { ComputationProvider } from './context/ComputationContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ComputationProvider>
      <Router>
        <div className="app-container">
          <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
          <div className="content-container">
            <Sidebar isOpen={sidebarOpen} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/molecular-generation" element={<MolecularGeneration />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/testing" element={<Testing />} />
                <Route path="/graph-discovery" element={<GraphDiscovery />} />
                <Route path="/drug-design" element={<DrugDesign />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ComputationProvider>
  )
}

export default App
