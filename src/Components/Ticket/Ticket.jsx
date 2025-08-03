import React from 'react';
import './Ticket.css';

const Ticket = ({ ticket, users, darkMode, onEdit, onDelete }) => {
  const user = users.find(u => u.id === ticket.userId);

  return (
    <div className={`ticket ${darkMode ? 'dark' : ''}`}>
      <div className="ticket-header">
        <span className="ticket-id">{ticket.id}</span>
        {user && (
          <span className="user-info">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span className="user-initials">{user.name.charAt(0)}</span>
            )}
          </span>
        )}
      </div>

      <h4>{ticket.title}</h4>
      <p>{ticket.description}</p>

      <div className="ticket-actions">
        <button onClick={() => onEdit(ticket)} className="edit-btn">✏️ Düzenle</button>
        <button onClick={() => onDelete(ticket.id)} className="delete-btn">🗑️ Sil</button>
      </div>
    </div>
  );
};

export default Ticket;
