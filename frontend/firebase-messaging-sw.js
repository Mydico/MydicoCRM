importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('../firebase-messaging-sw.js')
      .then(function(registration) {

      })
      .catch(function(err) {

      });
}
firebase.initializeApp({messagingSenderId: '1093124278858'});
// const initMessaging = firebase.messaging();
