import React from 'react';//react kuruphanesi içeri aktarıyoruz jsx  yazabilmek ve react kutuphanelirini kullaniblmek için gereklidir 
import ReactDOM from 'react-dom/client';// react dom kutuphanesinden createRoot fonksiyonunu  içeri aktarıyoruz.Bureact ile geln yeni bir yontemdir .
import './index.css';//  uygulama genelindeki stilleri burdan  yukluyoruz bu  dosya genlikler sıfırlamalar (reset ) ve  genl css tanımlamalarını içerir.
import App from './App';

//document get elemanbyıd ('root ') ile ile html deki div id div root elemanını seçiyoruz.
// ve `ReactDOM.createRoot` ile buraya React uygulamamızı bağlamak için bir "root" (kök) oluşturuyoruz.
// Ardından `root.render` ile App bileşenini bu root elemanına render ediyoruz.
//Bu işlem, React uygulamamızı tarayıcıda görüntülememizi sağlar.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

//index js  dosyası react uygulamasınıngirş entry  noktasıdır .Yani taraıyıcı ilk olarak  bu noktadan başlar 
//Buradaki app Ract da bileşenlerini kullanarak uygulamayı oluşturur ve render eder.
//ReactDOM.createRoot ile root elemanını oluşturuyoruz ve render metoduyla App bileşenini bu root elemanına bağlıyoruz.
//Bu sayede uygulama tarayıcıda görüntülenir. 