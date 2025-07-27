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
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <h2>🚀 Yeni Görev</h2>

      <input
        className="form-input"
        ref={inputRef}
        type="text"
        placeholder="Yeni görev ekle..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <label className="form-label">
        Durum:
        <select
          className="form-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {statuses.map((st, i) => (
            <option key={i} value={st}>{st}</option>
          ))}
        </select>
      </label>

      <label className="form-label">
        Öncelik:
        <select
          className="form-select"
          value={priority}
          onChange={e => setPriority(Number(e.target.value))}
        >
          {priorities.map((pr, i) => (
            <option key={i} value={i}>{pr}</option>
          ))}
        </select>
      </label>

      <button className="fancy-button" type="submit">+ Ekle</button>
    </form>
  );
}

export default AddTaskForm;
