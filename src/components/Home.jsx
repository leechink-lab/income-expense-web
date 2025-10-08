import React from 'react'

export default function Home({ onEnter, onReport }) {
  const today = new Date().toLocaleDateString()
  return (
    <div className="page center">
      <h1>今日 — {today}</h1>
      <div className="button-row">
        <button className="big-btn" onClick={() => onEnter('收入')}>收入</button>
        <button className="big-btn" onClick={() => onEnter('支出')}>支出</button>
      </div>
      <div style={{marginTop:24}}>
        <button className="secondary" onClick={onReport}>查看报告</button>
      </div>
    </div>
  )
}
