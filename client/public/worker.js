console.log("worker init");
self.addEventListener("push", (e) => {
  console.log("on push", e.data, e.data.json());
  // alert(`on push ${e.data.json()}`);
  const data = e.data.json();

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      image: "https://etpp.ru/full_logo.svg",
      icon: "https://etpp.ru/full_logo.svg",
      // timestamp: 1000 * 60 * 5,
    })
  );

  // e.waitUntil(handleNotification);

  // e.waitUntil(
  //   () => {
  //     // () => {
  //     self.registration.showNotification(data.title, {
  //       body: data.body,
  //       image: "https://etpp.ru/full_logo.svg",
  //       icon: "https://etpp.ru/full_logo.svg",
  //       // timestamp: 1000 * 60 * 5,
  //     });

  //     if (window?.queryClient) {
  //       window.queryClient.invalidateQueries();
  //     }
  //     // window.toast = toast;
  //   }
  //   // .onclick(() => {
  //   //     window.open("https://dev.223.etpp.ru");
  //   // })
  // );
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click Received.");
  console.info(event.notification);
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data));
});
