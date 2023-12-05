self.addEventListener("push", function (event) {
  if (event.data) {
    var myNotif = event.data.json();
    const promiseChain = self.registration.showNotification(myNotif.title, {
      body: myNotif.body,
      icon: "https://mobula.fi/mobula/fullicon.ong",
      badge: "https://mobula.fi/mobula/mobula-logo.svg",
    });

    event.waitUntil(promiseChain);
  } else {
  }
});
