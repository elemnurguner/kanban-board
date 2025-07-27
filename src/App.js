import { useState, useEffect } from 'react';
import Dashboard from "./Components/Dashboard/Dashboard";
import Navbar from "./Components/Navbar/Navbar";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {
  const [grouping, setGrouping] = useState(() => localStorage.getItem('grouping') || "Status");
  const [ordering, setOrdering] = useState(() => localStorage.getItem('ordering') || "Title");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = ['Backlog', "Todo", 'In progress', 'Done', 'Canceled'];
  const priorityMap = ['No priority', 'Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
        const res = await response.json();

        const savedTasks = JSON.parse(localStorage.getItem('kanban-tasks')) || [];
        const combined = [...res.tickets, ...savedTasks];

        // Unique ID'ye göre filtrele
        const uniqueTasks = combined.filter(
          (task, index, self) => index === self.findIndex(t => t.id === task.id)
        );

        setTasks(uniqueTasks);
        setUsers(res.users);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sürükle bırak sonrası liste güncelleme fonksiyonu (App seviyesinde)
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

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

    const newMap = [...ticketMap];
    const sourceCol = [...newMap[source.droppableId]];
    const [movedItem] = sourceCol.splice(source.index, 1);

    if (grouping === "Status") {
      movedItem.status = statuses[destination.droppableId];
    } else if (grouping === "User") {
      movedItem.userId = users[destination.droppableId]?.id;
    } else if (grouping === "Priority") {
      movedItem.priority = parseInt(destination.droppableId);
    }

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, movedItem);
      newMap[source.droppableId] = sourceCol;
    } else {
      const destCol = [...newMap[destination.droppableId]];
      destCol.splice(destination.index, 0, movedItem);
      newMap[source.droppableId] = sourceCol;
      newMap[destination.droppableId] = destCol;
    }

    const allTasks = newMap.flat();

    setTasks(allTasks);
    localStorage.setItem('kanban-tasks', JSON.stringify(allTasks));

    toast.info("📦 Görev taşındı!");
  };

  const handleAddTask = (task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: task.title || "Untitled",
      status: task.status || "Backlog",
      priority: typeof task.priority === 'number' ? task.priority : 0,
      userId: "user-1",
      tag: task.tag || ['New Task'],
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('kanban-tasks', JSON.stringify(updatedTasks));

    toast.success("Yeni görev eklendi!");
    console.log("Yeni görev eklendi:", newTask);
  };

  if (isLoading) {
    return (
      <div className={`loading-screen ${darkMode ? 'dark' : ''}`}>
        <div className="spinner"></div>
        <p>Loading Kanban Board...</p>
      </div>
    );
  }

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



      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default App;
