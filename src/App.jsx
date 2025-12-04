import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './style/App.css'
import Home from './pages/Home'
import MobDetails from './pages/MobDetails'
import AddMob from './pages/AddMob' 
import Navbar from './components/Navbar'

function App() {
  const signature =
    " ______   ______    _______  ___  \n" +
    "|      | |    _ |  |       ||   | \n" +
    "|  _    ||   | ||  |    ___||   | \n" +
    "| | |   ||   |_||_ |   |___ |   | \n" +
    "| |_|   ||    __  ||    ___||   | \n" +
    "|       ||   |  | ||   |___ |   | \n" +
    "|______| |___|  |_||_______||___| \n" +
    "                                  \n"

  console.log(signature)
  
  const [mobs, setMobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMobs()
  }, [])

  const fetchMobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mobs')
      const data = await response.json()
      if (data.success) {
        setMobs(data.data)
      }
    } catch (error) {
      console.error('Error fetching mobs:', error)
      // Fallback to local data if API fails
      const { mob_list } = require('./constants')
      setMobs(mob_list)
    } finally {
      setLoading(false)
    }
  }

  const addNewMob = async (newMob) => {
    try {
      const response = await fetch('http://localhost:5000/api/mobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMob),
      })
      const data = await response.json()
      if (data.success) {
        setMobs([...mobs, data.data])
        return data
      }
    } catch (error) {
      console.error('Error adding mob:', error)
      throw error
    }
  }

  const playMobSound = (mobId) => {
    setMobs(prevMobs =>
      prevMobs.map(mob =>
        mob.id === mobId
          ? { ...mob, isPlayingSound: true }
          : mob
      )
    )

    const mob = mobs.find(m => m.id === mobId)
    if (mob && mob.sound) {
      const audio = new Audio(mob.sound)
      audio.play()

      audio.onended = () => {
        setMobs(prevMobs =>
          prevMobs.map(mob =>
            mob.id === mobId
              ? { ...mob, isPlayingSound: false }
              : mob
          )
        )
      }
    }
  }

  return (
    <div className="app">
      <main className="main-content">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Home mobs={mobs} onPlaySound={playMobSound} loading={loading} />
            }
          />
          <Route
            path="/mob/:id"
            element={
              <MobDetails mobs={mobs} onPlaySound={playMobSound} />
            }
          />
          <Route
            path="/add-mob"
            element={
              <AddMob onAddMob={addNewMob} />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App