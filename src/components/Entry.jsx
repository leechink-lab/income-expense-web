import React, { useState, useRef } from 'react'
import Tesseract from 'tesseract.js'

export default function Entry({ type, onBack, onSave }) {
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('')
  const [listening, setListening] = useState(false)
  const fileRef = useRef()

  const startSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('此浏览器不支持语音识别，请使用 Chrome 或 Edge（桌面/安卓）')
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = 'zh-CN'
    rec.interimResults = false
    rec.onstart = () => setListening(true)
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript
      parseSpeech(text)
    }
    rec.onend = () => setListening(false)
    rec.start()
  }

  const parseSpeech = (text) => {
    const m = text.match(/(\d+(\.\d+)?)/)
    if (m) setAmount(m[0])
    const proj = text.replace(/(\d+(\.\d+)?)(元|块)?/g, '').replace(/收入|支出/g, '').trim()
    if (proj) setItem(proj)
    alert('识别结果: ' + text)
  }

  const onPickImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const { data: { text } } = await Tesseract.recognize(file, 'chi_sim+eng')
    const m = text.match(/(\d+(\.\d+)?)/)
    if (m) setAmount(m[0])
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    let proj = ''
    for (let l of lines) {
      if (!/\d/.test(l) && l.length >= 2 && l.length <= 12) { proj = l; break }
    }
    if (proj) setItem(proj)
    alert('OCR 识别:\n' + text.slice(0,200))
  }

  const save = () => {
    if (!amount || !item) {
      alert('请填写金额和项目')
      return
    }
    const rec = { id: Date.now(), type, amount: parseFloat(amount), item, date: new Date().toISOString() }
    onSave(rec)
  }

  return (
    <div className="page">
      <h2>{type}录入</h2>
      <label>金额</label>
      <input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal"/>
      <label>项目</label>
      <input value={item} onChange={e => setItem(e.target.value)}/>
      <div className="row">
        <button onClick={startSpeech}>{listening ? '识别中...' : '语音输入'}</button>
        <button onClick={() => fileRef.current.click()}>扫描收据</button>
        <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={onPickImage}/>
      </div>
      <div className="row" style={{marginTop:16}}>
        <button className="primary" onClick={save}>保存</button>
        <button className="secondary" onClick={onBack}>返回</button>
      </div>
    </div>
  )
}
