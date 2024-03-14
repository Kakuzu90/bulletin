import axios from "axios"

export default function useNotification() {
  const send = (payload) => {
    axios.post(
      "https://fcm.googleapis.com/fcm/send",
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer AAAAjpN2cH8:APA91bHKXqJGxx7IISvJQB4Kv4n_Y6UOT5PEK20zOiFAeANoeAyrxScP7EUmdwndMsQtu6xjwBtI14wXOQ4DG3nGIyr0mqvJNYUh8Gj54uGghMt9rVlgNIqCkTDtlVHD3BW7DiYtlN4J'
        }
      }
      )
  }

  return send;
}