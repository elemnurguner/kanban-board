// src/components/Column/Column.jsx
import React from 'react';
import Ticket from '../Ticket/Ticket';
import { priorityMap, statuses } from '../../constants';

const Column = ({ 
  title,
  status,
  tasks,
  users,
  darkMode,
  grouping 
}) => {
  const filteredTasks = tasks.filter(task => {
    if (grouping === 'Status') {
      return task.status === status;
    } else if (grouping === 'User') {
      const user = users.find(u => u.id === task.userId);
      return user?.name === title;
    } else if (grouping === 'Priority') {
      return priorityMap[task.priority] === title;
    }
    return false;
  });

  return (
    <div className={`column ${darkMode ? 'dark' : ''}`}>
      <h3>{title} ({filteredTasks.length})</h3>
      <div className="tasks-list">
        {filteredTasks.map(task => (
          <Ticket
            key={task.id}
            ticket={task}
            users={users}
            darkMode={darkMode}
            isNew={task.id.includes('task-')}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;