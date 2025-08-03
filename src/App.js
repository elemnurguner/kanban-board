import { useState, useEffect } from 'react'; //reactın temel  hooklarını us esatate durm yonetimi ve  use effect yan etkiler için
import Dashboard from "./Components/Dashboard/Dashboard";  //  dashbord bileşeni gorevlerin listlendiği  an tablo
import Navbar from "./Components/Navbar/Navbar";// Navbar bileşeni üs tdüğmelerin eklenmesi  filtreler ekle butonu ytem düğmmesi vb  işlemleri içi n
import { ToastContainer, toast } from "react-toastify"; //  bildirrimleri  gostermek  için kullanılar react tostfy kutupkhanesi

import 'react-toastify/dist/ReactToastify.css';// bildirimlerin  varsayılan stil dosyası 
import "./App.css";// uygulamanın genel stil dosyası

function App() {
  //Kullanıcının seçtiği  gruplama  turu (Status, User, Priority) local storege den alınır ve başlangıçta "Status" olarak ayarlanır
  const [grouping, setGrouping] = useState(() => localStorage.getItem('grouping') || "Status");
  //gorevlrin  sıralama olcutu  orneği  title local storege den alınır
  const [ordering, setOrdering] = useState(() => localStorage.getItem('ordering') || "Title");
  const [tasks, setTasks] = useState([]);//uygulamadaki  tüm gorevleri  tutan state   
  const [users, setUsers] = useState([]);// Kullanıcı bilgilerimi  saklayan state 
  // Kullanıcının karanlık modu seçip seçmediğini tutan state, başlangıçta localStorage'dan alınır
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isLoading, setIsLoading] = useState(true);// Apiden  veri çekerken gosterilecek yükleme durumu
  const [searchTerm, setSearchTerm] = useState('');// Kullanıcının arama çubuğuna girdiği terimi tutan stateyani aram  kutusuna yazılan metin gorev ram işlem i

  const statuses = ['Backlog', "Todo", 'In progress', 'Done', 'Canceled'];//Gorevlerin sahip olabileceği durumlar 
  const priorityMap = ['No priority', 'Low', 'Medium', 'High', 'Urgent'];//oncelik  seviyelrini ifade eden metin karşılıkları

  //tema değiştiğinde  body  nın sınıfına eklenir v e localstırege  kaydedilir
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);//sadece  dark mode  değiştiğinde  çlışır

  // ilk  çalışmada apiden  gorev ve kullnıcı bilgilerini çeker
  useEffect(() => {
    const fetchData = async () => {
      try {
        //api  isteğini gonderiyoruz
        const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
        const res = await response.json();
        //lcoalStorage'dan kaydedilmiş görevleri alıyoruz
        const savedTasks = JSON.parse(localStorage.getItem('kanban-tasks')) || [];
        // API'den gelen görevler ile localStorage'dan alınan görevleri birleştiriyoruz
        const combined = [...res.tickets, ...savedTasks];

        // Aynı id ye sahip olan idler ayıklanır dubllicate engellenir.
        const uniqueTasks = combined.filter(
          (task, index, self) => index === self.findIndex(t => t.id === task.id)
        );

        setTasks(uniqueTasks);// state   gorevler  ve kullanıcılar yuklenir
        setUsers(res.users);
      } catch (error) {
        // console.error("Veri çekme hatası:", error);// Hata durumunda konsola hata mesajı yazdırılır
        toast.error("Veri çekme hatası! Lütfen daha sonra tekrar deneyin.");
      } finally {
          //her  durumda  yukleme tamamlanmış sayılır bu olmadı sanki bu birazsıkıntılı 
        setIsLoading(false);
      }
    };

    fetchData();//sadece  bir  kez  çağrılır component mount edildiğinde
  }, []);

  // gorev surukle bırak  işlemi tamamlandıgında çalışır
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    //eğer hedef yer yoksa  işlemi  iptal et  
    if (!destination) return;
//  gorevleri  grupinge gore sutunlara ayır(status/priority /user)
    const ticketMap = (() => {
      switch (grouping) {
        case "Status":
          return statuses.map(status => tasks.filter(t => t.status === status));
        case "User":
          return users.map(user => tasks.filter(t => t.userId === user.id));
        case "Priority":
          return [0, 1, 2, 3, 4].map(priority => tasks.filter(t => t.priority === priority));
        default:
          return [tasks];
      }
    })();
// Taşınan ogeyi ve bulundugu kolonu belirle 
    const newMap = [...ticketMap];
    const sourceCol = [...newMap[source.droppableId]];
    const [movedItem] = sourceCol.splice(source.index, 1);
//grup turune  gore  guncelleme yap orneğin status değiştir
    if (grouping === "Status") {
      movedItem.status = statuses[destination.droppableId];
    } else if (grouping === "User") {
      movedItem.userId = users[destination.droppableId]?.id;
    } else if (grouping === "Priority") {
      movedItem.priority = parseInt(destination.droppableId);
    }
// aynı  kolona mıfarklı kolonamı taşıdıgını kontrol et 
    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, movedItem);
      newMap[source.droppableId] = sourceCol;
    } else {
      const destCol = [...newMap[destination.droppableId]];
      destCol.splice(destination.index, 0, movedItem);
      newMap[source.droppableId] = sourceCol;
      newMap[destination.droppableId] = destCol;
    }
//tüm gorevleri birletirip   güncelle
    const allTasks = newMap.flat();

    setTasks(allTasks);
    localStorage.setItem('kanban-tasks', JSON.stringify(allTasks));
    //kullanıcıya bildirim göster
    toast.info("📦 Görev taşındı!");
  };

  // yeni gorev eklem fonksiyonu 
  const handleAddTask = (task) => {
    const newTask = {
      id: `task-${Date.now()}`,// benzersiz bir id oluşturmak için zaman damgası kullanılır
      title: task.title || "Untitled",  // gorev başlığı 
      status: task.status || "Backlog",// varsayılan durum
      priority: typeof task.priority === 'number' ? task.priority : 0,// oncelik değeri 
      userId: "user-1",// varsayılan kullanıcı id
      tag: task.tag || ['New Task'],// etiketler
      createdAt: new Date().toISOString()// oluşturma zamnaı ekliycek
    };
    //yeni gorev listeye eklenilir kaydedilir
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('kanban-tasks', JSON.stringify(updatedTasks));
    //bildirim gosterilir
    toast.success("Yeni görev eklendi!");
    console.log("Yeni görev eklendi:", newTask);
  };
//veri çekme  işlemi devam ediyorsa yükleme ekranını göster
  if (isLoading) {
    return (
      <div className={`loading-screen ${darkMode ? 'dark' : ''}`}>
        <div className="spinner"></div>
        <p>Loading Kanban Board...</p>
      </div>
    );
  }
// uygulamanın ana gorunumunu dondurur
  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <Navbar
        setGrouping={setGrouping}
        setOrdering={setOrdering}
        onAddTask={handleAddTask}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Dashboard
        statuses={statuses}
        priorityMap={priorityMap}
        grouping={grouping}
        ordering={ordering}
        tasks={tasks}
        users={users}
        onDragEnd={handleDragEnd}
        searchTerm={searchTerm}
      />

      {/* ToastContainer bileşeni bildirimleri göstermek için kullanılır */}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default App;
