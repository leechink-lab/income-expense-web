import React, { useState, useEffect } from 'react'
import Home from './components/Home'
import Entry from './components/Entry'
import Report from './components/Report'

function App() {
  const [view, setView] = useState('home')
  const [type, setType] = useState('收入')
  const [records, setRecords] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem('records')
    if (raw) setRecords(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('records', JSON.stringify(records))
  }, [records])

  const addRecord = (rec) => {
    setRecords(prev => [rec, ...prev])
    setView('home')
  }

  return (
    <div className="app">
      {view === 'home' && (
        <Home
          onEnter={(t) => { setType(t); setView('entry') }}
          onReport={() => setView('report')}
        />
      )}
      {view === 'entry' && (
        <Entry
          type={type}
          onBack={() => setView('home')}
          onSave={addRecord}
        />
      )}
      {view === 'report' && (
        <Report
          records={records}
          onBack={() => setView('home')}
        />
      )}
    </div>
  )
}

export default App
