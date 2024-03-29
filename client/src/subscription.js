const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY)

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function sendSubscription(subscription) {
  const reactAppApiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.REACT_APP_API_URL;
  return fetch(`${reactAppApiUrl}/notifications/subscribe`, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function subscribeUser() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(registration) {
      if (!registration.pushManager) {
        console.log('Push manager unavailable.')
        return
      }

      registration.pushManager.getSubscription().then(function(existedSubscription) {
        console.log("\n\nExisted Subscription:", existedSubscription, "\n\n")
        if (existedSubscription === null) {
          console.log('No subscription detected, make a request.')
          registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
          }).then(function(newSubscription) {
            console.log('New subscription added.')
            sendSubscription(newSubscription)
          }).catch(function(e) {
            if (Notification.permission !== 'granted') {
              console.log('Permission was not granted.')
            } else {
              console.error('An error ocurred during the subscription process.', e)
            }
          })
        } else {
          console.log('Existed subscription detected.')
          sendSubscription(existedSubscription)
        }
      })
    })
      .catch(function(e) {
        console.error('An error ocurred during Service Worker registration.', e)
      })
  }
}

// This will return the user's subscription, if there is one.
export function getSubscription() {
  var promise = new Promise(function(resolve, reject) {
    if ('serviceWorker' in navigator) {
      return navigator.serviceWorker.ready.then(function(registration) {
        if (!registration.pushManager) {
          console.log('Push manager unavailable.')
          return
        }
    
        registration.pushManager.getSubscription().then(function(existedSubscription) {
          resolve(existedSubscription);
        })
      })
        .catch(function(e) {
          console.error('An error ocurred during Service Worker registration.', e)
        })
    }
  })
  return promise;
}

export function unsubscribeUser() {
  getSubscription().then(existedSubscription => {
    if (existedSubscription === null) return;

    // Remove the subscription from the database
    const reactAppApiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.REACT_APP_API_URL;
    fetch(`${reactAppApiUrl}/notifications/unsubscribe`, {
      method: 'POST',
      body: JSON.stringify(existedSubscription),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Unsubscribe the user
    existedSubscription.unsubscribe().then((successful) => {
      console.log(`Unsubscribing from ${existedSubscription}`)
      console.log("removed subscription")
    }).catch(err => console.log(err));
  })
}