import React, { useMemo } from "react";//react  kutuphanesini içeri aktarıyoruz  çünkü jsx yapısını kullancağız 
import './Dashboard.css';
import '../Ticket/Ticket.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";//sürekle barak bileşenleri için react biatiful dnd  işlemleri 
import { TAG_COLORS } from '../../constants/tagColors';//etiket renklerini içe aktarıyoruz
//ana bileşen dashboard
//props  ile gelen veriler
//grouping: Görevlerin hangi kritere göre gruplandığını belirtir (Durum, Kullanıcı, Öncelik)
//ordering: Görevlerin hangi kritere göre sıralandığını belirtir (Başlık, Öncelik)
//statuses: Mevcut durumları içerir
//priorityMap: Önceliklerin adlarını içerir
//tasks: Görevleri içerir
//users: Kullanıcıları içerir
//onDragEnd: Görev sürüklendiğinde çağrılan fonksiyon
//searchTerm: Arama terimini içerir
function Dashboard({ grouping, ordering, statuses, priorityMap, tasks, users = [], onDragEnd, searchTerm = '' }) {

  // Arama filtreleme: searchTerm varsa tasks'i filtrele
  const filteredTasks = tasks.filter(task => {
    const search = searchTerm.toLowerCase();// arama terimini  kcuk harflere çevir 
//başlık aıklama  kullnıcı adı durum ve öncelik adını arama terimi ile karşılaştır
    const titleMatch = task.title?.toLowerCase().includes(search);
    const descriptionMatch = task.description?.toLowerCase().includes(search);

    const user = users.find(u => u.id === task.userId);//ilgili  kullanıcıyı  bul
    const userMatch = user?.name?.toLowerCase().includes(search);

    const statusMatch = task.status?.toLowerCase().includes(search);
    const priorityName = priorityMap?.[task.priority]?.toLowerCase() || '';
    const priorityMatch = priorityName.includes(search);

    return titleMatch || descriptionMatch || userMatch || statusMatch || priorityMatch;// eğer herhangi biri eşleşiyorsa  bu taskı goster
  });

  // Gruplama & sıralama filtreden sonra filteredTasks üzerinden yapılır
  const ticketMap = useMemo(() => {
    if (!filteredTasks.length) return [];// eğer filtrelenmiş görev yoksa boş dizi döner

    let groupedData = [];
    // Gruplama kriterine göre görevleri grupla
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
//her  bir  grup içinde  gorevleri sıralama kriterlerine gore sırala
    return groupedData.map(group => {
      const sorted = [...group];//diziyi kopyala
      if (ordering === "Title") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));// başlığa göre alfabetik sıralama
      } else if (ordering === "Priority") {
        sorted.sort((a, b) => b.priority - a.priority);// önceliğe göre azalan sıralama
      }
      return sorted;
    });
  }, [filteredTasks, grouping, ordering, statuses, users]);

  // Grupların başlıklarını belirle yani  grupbaşlıgı uretici  indexe gore grup adını dondur 
  const getGroupTitle = (idx) => {
    switch (grouping) {
      case "Status": return statuses[idx] || `Group ${idx + 1}`;
      case "User": return users[idx]?.name || `User ${idx + 1}`;
      case "Priority": return priorityMap?.[idx] || `Priority ${idx}`;
      default: return `Group ${idx + 1}`;
    }
  };

  return (
    //tüm sürükle bırak yapısnı  oluşturan context bileşeni
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
                
               <h3>{getGroupTitle(idx)} ({ticketList.length})</h3>   {/*grup başlığı ve gorev sayısı */}
                               
                 {/* Bu grubun her görevi (kart) */}

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
                            {/* Kartın üst kısmı: id + kullanıcı */}

                            <div className="ticket-id">{ticket.id}</div>
                            {grouping !== "User" && (
                              <div className="ticket-user">
                                {users.find(u => u.id === ticket.userId)?.name || "Unknown"}
                              </div>
                            )}
                          </div>
                            {/* Kartın içeriği */}

                          <div className="ticket-content">
                            <div className="ticket-title"><b>{ticket.title}</b></div>
                            {/* Öncelik sadece gruplama Priority değilse gösterilir */}

                            {grouping !== "Priority" && (
                              <div className="ticket-priority">
                                Priority: {priorityMap?.[ticket.priority] || "N/A"}
                              </div>
                            )}
                            {/* Etiketler gösterilir */}

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
               {/* Sürükleme alanı dolu görünmesi için gerekli placeholder */}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
// Bileşeni dışa aktararak diğer dosyalarda kullanılabilir hale getiriyoruz

export default Dashboard;
