import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import InterviewPage from './pages/InterviewPage'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import InterviewModes from './components/InterviewModes'
import History from './components/History'
import Auth from './components/Auth'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './components/Unauthorized '
import NotFound from './components/NotFound'
import PublicRoute from './components/PublicRoute'
import { useCommonStore } from './store/CommonStore'
import { useEffect } from 'react'

function App() {
  const { me } = useCommonStore()

  useEffect(() => {
    me()
  }, [me])

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<PublicRoute />}> <Route path='/auth' element={<Auth />} /><Route path='/' element={<Auth />} /></Route>
          <Route element={<ProtectedRoute allowedRoles={["user",]} />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/start-interview' element={<InterviewPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/interview-modes' element={<InterviewModes />} />
            <Route path='/history' element={<History />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  )
}

export default App
