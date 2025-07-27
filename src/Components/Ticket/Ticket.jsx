import React from 'react';

const Ticket = ({ ticket, users, darkMode }) => {
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
    </div>
  );
};

export default Ticket;
