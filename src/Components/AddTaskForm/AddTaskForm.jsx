import React, { useState, useEffect, useRef } from 'react';
import './AddTaskForm.css';

const statuses = ["Backlog", "Todo", "In progress", "Done", "Canceled"];
const priorities = ["No Priority", "Low", "Medium", "High", "Urgent"];

function AddTaskForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(statuses[0]);
  const [priority, setPriority] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen geçerli bir başlık girin!');
      return;
    }

    const newTask = {
      title: title.trim(),
      status,
      priority: Number(priority),
      tag: ['Yeni Görev'],
      id: `temp-${Date.now()}`
    };

    onAdd(newTask);
    setTitle('');
    setStatus(statuses[0]);
    setPriority(0);
    onClose();  // Formu kapat
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <h2>🚀 Yeni Görev</h2>

      <input
        type="text"
        placeholder="Yeni görev ekle..."
        value={title}
        ref={inputRef}
        onChange={e => setTitle(e.target.value)}
        aria-label="Görev başlığı"
      />

      <label>
        Durum:
        <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Durum seçimi">
          {statuses.map((st, i) => (
            <option key={i} value={st}>{st}</option>
          ))}
        </select>
      </label>

      <label>
        Öncelik:
        <select value={priority} onChange={e => setPriority(Number(e.target.value))} aria-label="Öncelik seçimi">
          {priorities.map((pr, i) => (
            <option key={i} value={i}>{pr}</option>
          ))}
        </select>
      </label>

      <button type="submit">+ Ekle</button>
    </form>
  );
}

export default AddTaskForm;
