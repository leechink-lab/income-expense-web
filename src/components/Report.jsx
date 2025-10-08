import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Report({ records, onBack }) {
  const getWeekly = () => {
    const res = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      const label = `${d.getMonth()+1}/${d.getDate()}`
      const income = records.filter(r => {
        const dd = new Date(r.date)
        return dd.getFullYear()===d.getFullYear() && dd.getMonth()===d.getMonth() && dd.getDate()===d.getDate() && r.type==='收入'
      }).reduce((s,r)=>s+r.amount,0)
      const expense = records.filter(r => {
        const dd = new Date(r.date)
        return dd.getFullYear()===d.getFullYear() && dd.getMonth()===d.getMonth() && dd.getDate()===d.getDate() && r.type==='支出'
      }).reduce((s,r)=>s+r.amount,0)
      res.push({label, income, expense})
    }
    return res
  }

  const getMonthly = () => {
    const now = new Date()
    const days = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()
    const res = []
    for (let i = 1; i <= days; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), i)
      const income = records.filter(r => {
        const dd = new Date(r.date)
        return dd.getFullYear()===d.getFullYear() && dd.getMonth()===d.getMonth() && dd.getDate()===d.getDate() && r.type==='收入'
      }).reduce((s,r)=>s+r.amount,0)
      const expense = records.filter(r => {
        const dd = new Date(r.date)
        return dd.getFullYear()===d.getFullYear() && dd.getMonth()===d.getMonth() && dd.getDate()===d.getDate() && r.type==='支出'
      }).reduce((s,r)=>s+r.amount,0)
      res.push({label: `${d.getDate()}`, income, expense})
    }
    return res
  }

  const weekly = getWeekly()
  const monthly = getMonthly()
  const totalIncome = records.filter(r => r.type==='收入').reduce((s,r)=>s+r.amount,0)
  const totalExpense = records.filter(r => r.type==='支出').reduce((s,r)=>s+r.amount,0)
  const balance = totalIncome - totalExpense

  const weekData = {
    labels: weekly.map(w => w.label),
    datasets: [
      { label: '收入', data: weekly.map(w => w.income), backgroundColor: 'rgba(46, 204, 113,0.8)' },
      { label: '支出', data: weekly.map(w => w.expense), backgroundColor: 'rgba(231, 76, 60,0.8)' }
    ]
  }

  const monthData = {
    labels: monthly.map(m => m.label),
    datasets: [
      { label: '收入', data: monthly.map(m => m.income), backgroundColor: 'rgba(46, 204, 113,0.8)' },
      { label: '支出', data: monthly.map(m => m.expense), backgroundColor: 'rgba(231, 76, 60,0.8)' }
    ]
  }

  return (
    <div className="page">
      <h2>简图报告</h2>
      <div style={{height:260}}>
        <h3>本周收入与支出</h3>
        <Bar data={weekData} options={{responsive:true}} />
        <p style={{color: balance>=0? 'green':'red', fontWeight:700}}>
          {balance>=0? `本周余额：¥${balance.toFixed(2)}` : `本周透支：¥${Math.abs(balance).toFixed(2)}`}
        </p>
      </div>
      <hr/>
      <div style={{height:260}}>
        <h3>本月收入与支出</h3>
        <Bar data={monthData} options={{responsive:true}} />
        <p style={{color: balance>=0? 'green':'red', fontWeight:700}}>
          {balance>=0? `本月盈余：¥${balance.toFixed(2)}` : `本月透支：¥${Math.abs(balance).toFixed(2)}`}
        </p>
      </div>
      <div style={{marginTop:16}}>
        <button onClick={onBack}>返回</button>
      </div>
    </div>
  )
}
