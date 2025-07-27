import React, { useMemo } from "react";
import './Dashboard.css';
import '../Ticket/Ticket.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TAG_COLORS } from '../../constants/tagColors';

function Dashboard({ grouping, ordering, statuses, priorityMap, tasks, users = [], onDragEnd, searchTerm = '' }) {

  // Arama filtreleme: searchTerm varsa tasks'i filtrele
  const filteredTasks = tasks.filter(task => {
    const search = searchTerm.toLowerCase();

    const titleMatch = task.title?.toLowerCase().includes(search);
    const descriptionMatch = task.description?.toLowerCase().includes(search);

    const user = users.find(u => u.id === task.userId);
    const userMatch = user?.name?.toLowerCase().includes(search);

    const statusMatch = task.status?.toLowerCase().includes(search);
    const priorityName = priorityMap?.[task.priority]?.toLowerCase() || '';
    const priorityMatch = priorityName.includes(search);

    return titleMatch || descriptionMatch || userMatch || statusMatch || priorityMatch;
  });

  // Gruplama & sıralama filtreden sonra filteredTasks üzerinden yapılır
  const ticketMap = useMemo(() => {
    if (!filteredTasks.length) return [];

    let groupedData = [];
    switch (grouping) {
      case "Status":
        groupedData = statuses.map(status =>
          filteredTasks.filter(t => t.status === status)
        );
        break;
      case "User":
        groupedData = users.map(user =>
          filteredTasks.filter(t => t.userId === user.id)
        );
        break;
      case "Priority":
        groupedData = [0, 1, 2, 3, 4].map(priority =>
          filteredTasks.filter(t => t.priority === priority)
        );
        break;
      default:
        groupedData = [filteredTasks];
    }

    return groupedData.map(group => {
      const sorted = [...group];
      if (ordering === "Title") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      } else if (ordering === "Priority") {
        sorted.sort((a, b) => b.priority - a.priority);
      }
      return sorted;
    });
  }, [filteredTasks, grouping, ordering, statuses, users]);

  // Diğer kod aynen kalır...
  const getGroupTitle = (idx) => {
    switch (grouping) {
      case "Status": return statuses[idx] || `Group ${idx + 1}`;
      case "User": return users[idx]?.name || `User ${idx + 1}`;
      case "Priority": return priorityMap?.[idx] || `Priority ${idx}`;
      default: return `Group ${idx + 1}`;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="dashboard-main">
        {ticketMap.map((ticketList, idx) => (
          <Droppable droppableId={String(idx)} key={idx}>
            {(provided) => (
              <div
                className="dashboard-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3>{getGroupTitle(idx)} ({ticketList.length})</h3>

                {ticketList.map((ticket, index) => (
                  <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="ticket-container"
                      >
                        <div className="ticket-main">
                          <div className="ticket-header">
                            <div className="ticket-id">{ticket.id}</div>
                            {grouping !== "User" && (
                              <div className="ticket-user">
                                {users.find(u => u.id === ticket.userId)?.name || "Unknown"}
                              </div>
                            )}
                          </div>
                          <div className="ticket-content">
                            <div className="ticket-title"><b>{ticket.title}</b></div>
                            {grouping !== "Priority" && (
                              <div className="ticket-priority">
                                Priority: {priorityMap?.[ticket.priority] || "N/A"}
                              </div>
                            )}

                            <div className="ticket-tags">
                              {ticket.tag && ticket.tag.map((tag, i) => (
                                <span
                                  key={i}
                                  className="ticket-tag"
                                  style={{ backgroundColor: TAG_COLORS[tag] || '#ccc' }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default Dashboard;
