self.addEventListener('push', function(event) {
  console.log("A push was pushed")
  const data = event.data.json()
  console.log('New notification', data)
  const options = {
    body: data.body,
  }
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})