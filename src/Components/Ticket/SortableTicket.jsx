    // src/Components/Ticket/SortableTicket.jsx
import React from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Ticket from './Ticket';

function SortableTicket({ ticket }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Ticket ticket={ticket} />
    </div>
  );
}

export default SortableTicket;
