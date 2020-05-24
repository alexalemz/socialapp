// var db = require("../models");
const webpush = require("web-push");
webpush.setVapidDetails(
  process.env.WEB_PUSH_CONTACT, 
  process.env.PUBLIC_VAPID_KEY, 
  process.env.PRIVATE_VAPID_KEY
);

async function sendNotification(subscription, stringifiedPayload) {
  console.log("\n\nNotification is getting sent", stringifiedPayload)

  const payload = stringifiedPayload;

  return webpush.sendNotification(subscription, payload)
  
}

function payloadGenerator(messageBody) {
  const payload = JSON.stringify({
    title: 'Social App',
    body: messageBody,
  })

  return payload;
}

module.exports = { sendNotification, payloadGenerator };