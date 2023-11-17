import { API_ENDPOINT } from "../constants";

export function askPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission((result) => {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then((permissionResult) => {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function subscribeUserToPush(address: string) {
  return navigator.serviceWorker
    .register("/service-notification.js")
    .then(async (registration) => {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BAVa9V-kO4Sgh_XKQ7UZp8Zx9exgdDzJCCmj1_-jp96mxcLipZZRdsXLTCl2sfx2etsUdsh7dnX71ooPBTa1g0E"
        ),
      };

      await new Promise((resolve) => {
        setTimeout(resolve, 10000);
      });

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then((pushSubscription) => {
      const pushedObject = JSON.parse(JSON.stringify(pushSubscription));
      pushedObject.address = address;
      fetch(`${API_ENDPOINT}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pushedObject),
      });
      return pushedObject;
    });
}
