// src/constants.js
//priorityMap gorevlerin oncelik dzueylerini temsil eder 
export const priorityMap = {
  0: 'No Priority',//oncelik verilmemiş gorevler için
  1: 'Low',// düşük öncelikli görevler için
  2: 'Medium', // orta öncelikli görevler için
  3: 'High',// yüksek öncelikli görevler için
  4: 'Urgent'// acil görevler için
};
// status dizindeki gorevlerin alabileceği durumalrı belirtir
//bu dizideki her bir değer  bir gorev durumu olarak  gorev kartalrında kullanılabilir
export const statuses = ['Backlog', 'Todo', 'In Progress', 'Done', 'Cancelled'];