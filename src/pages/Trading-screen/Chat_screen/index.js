// import {useEffect, useState} from "react";
// import {db} from "../../../../firebaseConfig";
// const Line = () => {
//     const [message, setMessage] = useState('');
//
//     useEffect(() => {
//         db.collection("messages");
//         .orderBy("createdAt", "desc")
//             .limit(50)
//             .onSnapshot(snapshot => {
//                 setMessage(snapshot.map((doc) => doc.data()));
//             })
//     })
//
//     return(
//         <div>
//         </div>
//     )
// }