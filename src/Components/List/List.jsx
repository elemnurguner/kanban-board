import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import Ticket from "../Ticket/Ticket";
import './List.css';

function List({ ticketList, setTicketList, searchTerm, users }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = ticketList.findIndex((t) => String(t.id) === String(active.id));
      const newIndex = ticketList.findIndex((t) => String(t.id) === String(over.id));

      const newList = arrayMove(ticketList, oldIndex, newIndex);
      setTicketList(newList);
    }
  };

  const filteredTickets = ticketList.filter((ticket) => {
    const search = searchTerm.toLowerCase();

    const titleMatch = ticket.title?.toLowerCase().includes(search);
    const descriptionMatch = ticket.description?.toLowerCase().includes(search);

    // user.name kontrolü, user objesini users listesinden buluyoruz
    const userObj = users.find(u => u.id === ticket.userId);
    const userMatch = userObj?.name?.toLowerCase().includes(search);

    const statusMatch = ticket.status ? ticket.status.toLowerCase().includes(search) : false;

    // priority sayısal ise, örneğin 0-4, isim karşılığı yapabiliriz, yoksa string karşılığı ile kontrol
    const priorityNames = ['no priority', 'low', 'medium', 'high', 'urgent'];
    const priorityIndex = typeof ticket.priority === 'number' ? ticket.priority : -1;
    const priorityMatch =
      priorityIndex >= 0
        ? priorityNames[priorityIndex]?.includes(search)
        : (ticket.priority?.toString().toLowerCase().includes(search) || false);

    return titleMatch || descriptionMatch || userMatch || statusMatch || priorityMatch;
  });

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={filteredTickets.map((t) => String(t.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="list-main">
          {filteredTickets.map((ticket) => (
            <SortableItem key={ticket.id} id={String(ticket.id)}>
              <Ticket ticket={ticket} users={users} />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default List;
