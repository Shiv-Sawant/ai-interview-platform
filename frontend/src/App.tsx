import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import InterviewPage from './pages/InterviewPage'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import InterviewModes from './components/InterviewModes'
import History from './components/History'
import Auth from './components/Auth'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/start-interview' element={<InterviewPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/interview-modes' element={<InterviewModes />} />
          <Route path='/history' element={<History />} />
          <Route path='/auth' element={<Auth />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  )
}

export default App
