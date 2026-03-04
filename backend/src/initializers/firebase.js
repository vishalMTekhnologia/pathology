import admin from "firebase-admin";
import serviceAccount from "../../memorifygallery-firebase-adminsdk-fbsvc-fe6590b372.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;