import React from "react";//react kutuphanesi import ediliyor
import { DndContext, closestCenter } from "@dnd-kit/core";// dnd kit kutuphanesinden gerkli parçalar import ediliyor//DndContext rurukle bırak alanını tanımlar .//closser en yakın  ogeyi  tespit etmek için kıllnırlır(çarpışma algılama  işlemi)
//sortable  için  gerekli araçları yukluyoruz
//sortable context ,sıralanabilir alanları tnaımlar 
//arrayMove,liste ogelerini taşımak için kullanılır
//verticalListSortingStrategy, dikey  liste sıralaması stratejisi



import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";//sotable ıtem  her bir bileşeni sürüklenebilri  hale getiren ozel  wrapper 
import Ticket from "../Ticket/Ticket";//ticket her bir gorev kartınıtemsil eden bileşen
import './List.css';

function List({ ticketList, setTicketList, searchTerm, users }) {//list bileşenlerini tanımlıyoruz ,props: ,ticket list:  tüm gorev kartlarının listesi ,setticketlist:listeyi guncellemek için kullanılır ,searxh term: aram  kutusundaki  değer   ,users:kulllnaıcı  listesi avater vs
  const handleDragEnd = (event) => {// sürükleme  işlemi bittiğinde  çalışacak fonkdiyon 
    const { active, over } = event;//sürüklenen ve bırakılan öğeleri alıyoruz
    // eğer bırakılan öğe yoksa  hiçbir şey yapma
    if (!over) return;

    if (active.id !== over.id) {// eğer farklı bir konuma bırakıldıysa
      const oldIndex = ticketList.findIndex((t) => String(t.id) === String(active.id));//eski indexleri  buluyoruz
      const newIndex = ticketList.findIndex((t) => String(t.id) === String(over.id));//yeni indexleri buluyoruz

      const newList = arrayMove(ticketList, oldIndex, newIndex);//arrayMove ile listeyi yeni konuma taşıyoruz
      // yeni listeyi güncelliyoruz
      setTicketList(newList);
    }
  };
//arama terimi ile filtreleme işlemi  
  const filteredTickets = ticketList.filter((ticket) => {
    const search = searchTerm.toLowerCase();//küçük harfle  çevir
// başlık açıklama ve  kullanıcı adı kontrolu 
    const titleMatch = ticket.title?.toLowerCase().includes(search);
    const descriptionMatch = ticket.description?.toLowerCase().includes(search);
    //başlık ve açıklama ve  kullavnıcı adı  kontrolu  
    // user.name kontrolü, user objesini users listesinden buluyoruz
    const userObj = users.find(u => u.id === ticket.userId);
    const userMatch = userObj?.name?.toLowerCase().includes(search);
// stattu kontrolu 
    const statusMatch = ticket.status ? ticket.status.toLowerCase().includes(search) : false;
// öncelik kontrolü
// eğer öncelik sayısal ise, örneğin 0-4, isim karşılığı yapabiliriz, yoksa string karşılığı ile kontrol
// priority sayısal ise, örneğin 0-4, isim karşılığı yapabiliriz, yoksa string karşılığı ile kontrol
    const priorityNames = ['no priority', 'low', 'medium', 'high', 'urgent'];
    const priorityIndex = typeof ticket.priority === 'number' ? ticket.priority : -1;
    const priorityMatch =
      priorityIndex >= 0
        ? priorityNames[priorityIndex]?.includes(search)
        : (ticket.priority?.toString().toLowerCase().includes(search) || false);

    return titleMatch || descriptionMatch || userMatch || statusMatch || priorityMatch;
  });//herhangi biri eşleşiyorsa true doner

  return (// sürükle bırak bağlamı  tanımlanıyor 
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {/* SortableContext: Liste sıralamasını belirlemek için kullanılıyor */}

      <SortableContext
        items={filteredTickets.map((t) => String(t.id))}//id leri stringlere  çebiriyoruz
        strategy={verticalListSortingStrategy}// dikey sıralma stratejisi
      >
        <div className="list-main">
                    {/* Filtrelenmiş ticket'lar dönülüyor */}
          {filteredTickets.map((ticket) => (
            // SortableItem: Her bir ticket'ı sürüklenebilir hale getiriyor
            // key: React için benzersiz anahtar, id'yi string olarak kullanıyoruz
            <SortableItem key={ticket.id} id={String(ticket.id)}>
              {/* Ticket bileşeni: Her bir görev kartını temsil ediyor */}
              <Ticket ticket={ticket} users={users} />
              {/* Ticket bileşenine kullanıcıları ve diğer bilgileri gönderiyoruz */}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default List;
//list bileşeni ne işe yarar , gorev kartları ve ticketları  listeler , arama kutusunadki değere gore filtreleme yapar  ,kartlarısürükleyip yeni pozisyona bırakamaıza olanak sağlar,
//her kartı sortoble ıtem içine alarak  sıralanabilir hale getiriyor  kullanıcı avavtarı başlık  açıklam a oncelik vs   ile detaylar gosteriliyor 