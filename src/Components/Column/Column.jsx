// src/components/Column/Column.jsx
import React from 'react';
import Ticket from '../Ticket/Ticket';//tekil gorev kartı bileşenini içe aktarıyoruz
import { priorityMap, statuses } from '../../constants';// öncelik  isimleirni ve duumlarını içeren sabitleri içe aktarıyoruz
// Column bileşeni, görev kartlarını sütunlar halinde görüntüler
//bu  biileşen  bir sutunu orn : todo high priorty ali  temsil eder
const Column = ({ 
  title,// sütun başlığı
  status,// sütun durumu (örn: 'todo', 'in-progress', 'done')
  tasks,// görevler
  users,// kullanıcılar
  darkMode,// koyu mod durumu
  grouping // gruplama kriteri
}) => {
  const filteredTasks = tasks.filter(task => {// bu sütunda gösterilecek görevleri filtreliyoruz
    if (grouping === 'Status') {// eğer gruplam status  ise gorevin bu durumu  sutunun durumuna eşit mi 
      return task.status === status;
    } else if (grouping === 'User') {// eğer gruplma  user ise gorevin kullanıcıadı  sutunun başlığınaeşit mi
      const user = users.find(u => u.id === task.userId);// gorevle  eşleşen ıd  yı bul
      return user?.name === title;// kullanıcının adı sütunun başlığına eşit mi
    } else if (grouping === 'Priority') {//eğer gruplama  priority  ise   görevin önceliği  sütunun başlığına eşit mi
      // priorityMap, öncelik isimlerini sütun başlıklarına eşler
      return priorityMap[task.priority] === title;
    }
    return false; // diğer durumlar  için hiçbir gorev dahil edilmez
  });
// sütun görünümünü döndürüyoruz
  return (
    //karanlık moddamı açık moddamı   kontrol ediyoruz ,class ı ona gore  belirliyoruz
    <div className={`column ${darkMode ? 'dark' : ''}`}>
      <h3>{title} ({filteredTasks.length})</h3>
       {/* gorev tasklarının listesini gösteriyoruz */}
      <div className="tasks-list">
        {filteredTasks.map(task => (
          <Ticket
            key={task.id}//react için benzersiz anahtar
            ticket={task}// gorev  objesini ticket  bileşenine   gonderiyoruz
            users={users}// kullanıcıları  ticket bileşenine gonderiyoruz
            darkMode={darkMode}// tema bilgisi  gonderiliyor
            isNew={task.id.includes('task-')}//yeni gorev mi diye kontrol et (id si task- ile başlıyorsa yeni bir görev )eklenmiştir demek
          />
        ))}
      </div>
    </div>
  );
};

export default Column;//  bu bileşeni dışa aktarıyoruz ,başka yerlerde kullanılabilir halde olsun diye