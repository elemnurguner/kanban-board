import React from "react";// react kutuphanesin ii çe aktarır  
import { useSortable } from "@dnd-kit/sortable";  //dnd  kiti n use sortable hookunu içe  aktarır ,bu hook bir  ogegi surukleneiblri ve sıralanabilir  YAPMAK İÇİN KULLANILIR 
import { CSS } from "@dnd-kit/utilities";// csss yardımıyla suruklemm sırasında oluşan donuşum 

// bu bileşen dışarıda aldıgı id lerle sıralanabilir bir  ıtem  ı temsil eder ,children  ise   içine başka bileşenler veya  html ogeler i almasını sağlar 
function SortableItem({ id, children }) {  // 'useSortable' hook'u ile öğeyi sıralanabilir hale getiriyoruz
  //bu hook bazı özellikler döner, bu özellikler öğenin sıralanabilir olmasını sağlar
  const {
    attributes,// suruklenebilirlik için gerkli olan bazı attrıbuletleri ekler  role tabındex  vs
    listeners,// suruklem  olaylarını dinlemek için   gerekli  olayları onmouse Down  vs içeriir
    setNodeRef,// bu referans  dnd  kit in dom elementlerine erişmesi için gereklidir
    transform,// suruklme sırasında  oluşan  hareketin  (x,y) donusum verisi
    transition,// ogenin  yumuşak geçiş sonrası animasyonu için  stil bilgisi 
  } = useSortable({ id: id });// use sortable a  bileşeni tanımlayan  benzersiz id verilir

  // oge surukleme hareketi  uygulandıgında  bu stil  ayarlanır
  const style = {
    transform: CSS.Transform.toString(transform),//hareketi  css stringine çevirir
    transition,// geçiş efecti  orneğin yumuşak hareket 
    cursor: "grab",// fare  ikonu tutma  şeklinde  olur 
  };

  return (
    // ogeyi dnd sistemine tanıttıgımız div
    <div ref={setNodeRef}// bu ogeyi  dnd sistemine bağlayan  referans 
     style={style}// yuakrıda  tanımladıgınız surukleme stilleri 
      {...attributes} // gerekli  html  ozelikleri 
      {...listeners}// surukleme  olaylarını  tetikleyen   dinleyiciler 
      > 
      {children}
      {/* //  içeriğe dışarıdan gelen bileşenleir orneğin bir  kart ticket vs yerleştirir */}
    </div>
  );
}

export default SortableItem;
