import React, { useState } from 'react';
import "./Navbar.css";
import TuneIcon from '@mui/icons-material/Tune';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddTaskForm from '../AddTaskForm/AddTaskForm';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function Navbar({ 
  setGrouping, 
  setOrdering, 
  onAddTask, 
  darkMode, 
  setDarkMode, 
  searchTerm, 
  setSearchTerm 
}) {
  const groupingOptions = ['Status', 'User', 'Priority'];
  const orderingOptions = ['Title', 'Priority'];

  const [optionsView, setOptionsView] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleOptions = () => setOptionsView(!optionsView);
  const toggleForm = () => setShowForm(!showForm);

  const handleGroupingChange = (e) => {
    const value = e.target.value;
    localStorage.setItem("grouping", value);
    setGrouping(value);
  };

  const handleOrderingChange = (e) => {
    const value = e.target.value;
    localStorage.setItem("ordering", value);
    setOrdering(value);
  };

  const handleTaskSubmit = (task) => {
    onAddTask(task);
    setShowForm(false);
  };

  return (
    <div className='navbar-main' >
      {/* Sol bölüm */}
      <div className='navbar-left'>
        <div className='navbar-options-dropdown'>
          <button 
            id="navbar-dropdown-button" 
            onClick={toggleOptions} 
            aria-label="Display options"
          >
            <TuneIcon sx={{ fontSize: "18px" }} />
            <span id="navbar-dropdown-text">Göster</span>
            <ArrowDropDownIcon />
          </button>
          {optionsView && (
            <div className='navbar-options'>
              <div className='navbar-option'>
                <label htmlFor="grouping">Grup</label>
                <select
                  id="grouping"
                  value={localStorage.getItem('grouping') || 'Status'}
                  onChange={handleGroupingChange}
                >
                  {groupingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className='navbar-option'>
                <label htmlFor="ordering">Sıralama</label>
                <select
                  id="ordering"
                  value={localStorage.getItem('ordering') || 'Title'}
                  onChange={handleOrderingChange}
                >
                  {orderingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orta bölüm */}
      <div className='navbar-center'>
        <input
          type="text"
          aria-label="Search tasks"
          placeholder="Arama Yap"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="navbar-search-input"
        />
      </div>

      {/* Sağ bölüm */}
      <div className='navbar-right'>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          {darkMode ? ' Açık Mod' : ' Koyu Mod'}
        </button>

        <button
          onClick={toggleForm}
          className="add-task-button"
          aria-label="Add new task"
        >
          Görev Ekle
        </button>
      </div>

      {/* Görev ekleme formu açılır */}
      {showForm && (
        <div className="navbar-task-form">
          <AddTaskForm 
            onAdd={handleTaskSubmit} 
            onClose={() => setShowForm(false)} 
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;
