// src/Components/Ticket/SortableTicket.jsx
import React from 'react'
//dnd kit kutuphanesinden user sortable hookunu  ve css aracını  import eder 
//usesortable  her bileşeni ssuruklenebilir hale getirmek için kullanılır 
//css  sürükleme animasyonları   duzgunce kullabmak için  kullanılır 
import { useSortable } from '@dnd-kit/sortable';  
import { CSS } from '@dnd-kit/utilities';
// bu bileşen  içerisinde  asıl kullanacağımız  tiket  kartıı 
import Ticket from './Ticket';
//sortable ticket bileşeni tanımlanır  .Parametre olarak bir  ticket  nesnesi alır.
//bu  ticket nesnesi   orneğin bir gorev kartı olabilir içinde başlık açıklama  gibi  bilgiler  vardır. 
function SortableTicket({ ticket }) {
  //user sortable hooku çağrılır ve kartın  benzerisz  kimliği verilri .Bu hook bize  sürükleme için gerekli olan eevnt  listinerlarını  verir.
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ticket.id });

  //karttın suruklem anındaki  stilini tanımlıyoruz 
  // transform suruklenen konumunu  değiştirmek için 
  //transitoon bgeçiş  evefektleri  orneğin surukleyip bıraktıgında  uymuşakca  yrerine oturması için
  const style = {
    transform: CSS.Transform.toString(transform),//pozisyon donuşumunu stringe  ceviri
    transition,//animasyon geçişi 
    cursor: 'grab',// gorsel olarak suruklenebilr  oldugun belirler
  };
  // bileşenin  jsx  çıktısı 

  return (
    //setnoref -> dom ogesini   dnd kit e  tanıtmak için kullnıılır (yanı hang. elanın suruklenbilir oldugunu bildiir)
    //attributes ve listener  dnd   kitn surukleme işlemini  dinleyip yonetmesin sğalar 
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
  {/* ticket bileşeni suruklenebilir div  içinde render edilir */}
      <Ticket ticket={ticket} />
    </div>
  );
}

export default SortableTicket;
