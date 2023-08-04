console.log("worker init");
self.addEventListener("push", (e) => {
  console.log("on push", e.data);
  const data = e.data.json();
  e.waitUntil(
    // () => {
    self.registration.showNotification(data.title, {
      body: data.body,
      image: "https://etpp.ru/full_logo.svg",
      icon: "https://etpp.ru/full_logo.svg",
      timestamp: 1000 * 60 * 5,
    })
    // }
    // .onclick(() => {
    //     window.open("https://dev.223.etpp.ru");
    // })
  );
});
