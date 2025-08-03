// src/Components/SortableItem/SortableItem.jsx
import React from 'react';// react kutuphanesini içe aktarıyoruz 
import { useSortable } from '@dnd-kit/sortable';// dnd kit sorteble dan use sortable  hookunu  içe aktarıyoruz// bu hook  bir ogeyi suruklenebilir hale  getirmek için  kullanılır
import { CSS } from '@dnd-kit/utilities';// mcss transformlarını stringe çevirmke için kullanılır 

//sortable ıtem adında bir rect fonksiyonel bileşeni  tanımlıyoruz 
// props uzerinden id style ve children gibi değerleri alır 
function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });// user sortable hookunu çağırıyoruz  ve ona bir id veriyoruz bu  id  suruklenebilir ogeyi  tanımlama k için gereklidir 
// ogenin stilini tanımlıyoruz
// tarnsform surukleme  hareketini gore ogeyi  taşı 
//transition surukleme sırasında  geçiş efekti 
//cursor  grab  fare  imleci el gibi gorunur 
//props .style değince de  dışarıdan  gelen ekstra stil varsa ekle diyoruz
  const style = {
    transform: CSS.Transform.toString(transform),// hareketi   stil  olarak uygula 
    transition,
    cursor: 'grab',
    ...props.style,
  };
// bileşen jsx  çıkıt  ekrana   bastıgı html benzeri yapı 
  return (
    //div  ogesini usersortable  hookunun sağlandıgı referansla bağla 
    //bu div artık suruklenebilir  bir alan  olacak 
    <div ref={setNodeRef}//drag drop  işlemleri için bu referansı kullanacaksın 
     style={style} // yukarıda  tanımlana stiller uygulanıyor 
     {...attributes} //aria  gibi erişilebilirlik ve tanımlayıcı ozellikler
     {...listeners}// fareyle tıklama surkleme gibi olay dinleyicileri
     
     >
       {props.children} {/* bu divin  içine dışarıdan verilen bileşenler veya  içerikller   basılır */}
    </div>
  );
}

export default SortableItem;
