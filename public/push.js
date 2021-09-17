var webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BIQ9O57YxZMrGrtPM4IcFMakEvIWaldk0xHHwhLnmnLJYZtbXlJN6y7tiWXVY1BOpQ5S4BAaVcoGWvpW4psg2Rs",
   "privateKey": "qSNzbv2mrp5jC47_P9MANnYDlDh-OzKMxmWT_nQ_hmw"
};


webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/dqah41Sl1FY:APA91bE3IyFMaoDLcA8zQ63mbVsI6sPO-9-NUOKvpPvHR8PRgICjaIWKtoF1dTL0I01pAMV3n_usjm5m7VIAmsYFie2Ja4J09sS3qNMRS6wIbulLkGoOakIg3uOaz_8f7fB3B-B2fImg",
   "keys": {
      "p256dh": "BK5jozByqUvS0RhyMWjH27nSi6nt6TM8pExakB0fOrtLwirvEtBkid4TNh2m3w/W/8QtIkOKmplJ3x9EbENRqe4=",
      "auth": "K3zXO1e+4Ipiots1Z4wOMg=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
   gcmAPIKey: '40474997312',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
).then((success) => {
   console.log(success);
}).catch((error) => {
   console.log(error);
})
