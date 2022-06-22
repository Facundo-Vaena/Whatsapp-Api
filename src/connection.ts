import makeWASocket, {
  useSingleFileLegacyAuthState,
  useSingleFileAuthState,
  DisconnectReason,
  makeInMemoryStore,
  
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
const QRcode = require("qrcode");
import path from "path";
const fs = require("fs");
const SESSION = "./auth_credentials_nose.json";

export const connect = async () => {
  const { state, saveState }: any = useSingleFileAuthState(SESSION);

  console.log("existe?", fs.existsSync(SESSION));
  const fileExistence = fs.existsSync(SESSION);
  const socket = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    getMessage: async (key: any) => {
      return { conversation: "hello" };
    },
  });
  console.log("socket: ", socket);
  
  socket.ev.on("creds.update", saveState);
  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    // console.log("cuERRE: ", qr);
    // console.log("connection: ", connection);

    if (qr) {
      const url = await QRcode.toDataURL(qr);
      console.log("URL", url);
    }


    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log("reason: ", reason);
      if (reason === DisconnectReason.connectionClosed) {
        console.log("connection closed, reconnecting...");
        connect();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("connection lost, reconnecting");
        connect();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("connection replaced");
        // console.log("entre aca");
        socket.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log("device loggedout");
        if (fileExistence) {
          fs.unlink(`${SESSION}`, (err: any) => {
            if (err) throw err;
            console.log("file was deleted");
          });
        }
        // socket.logout();
        // console.log("pase el socket.logout");
        connect();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("restart required. Restarting...");
        connect();
      } else {
        // console.log("entre al else");
        socket.end(
          new Error(
            `unknow disconnect reason: ${reason}|${lastDisconnect?.error}`
          )
        );
      }
    }
    // const lastmsgsInChat = await socket. 
  });
  socket.ev.on("messages.upsert", m => {
    // console.log("EME: ", m);
    // console.log("m.messages: ", m.messages);
    // console.log("m.messages[0].message: ", m.messages[0].message);

  })
  let yourChats: any[];
  let yourMessages: any[];
  let yourContacts: any[];
  socket.ev.on("chats.set", async ({ chats, isLatest }: { chats: any; isLatest: boolean }) => { //Lo pongo en connection solo para probar. iria en otro lado
    // console.log("chats1: ", chats.slice(0, 4));
    // console.log("length: ", chats.length);
    // console.log("isLatest: ", isLatest);
    const recivedChats = chats.slice(0,5).map((chat: any) => { 
      return {
        ...chat,
        messages: [],
      };
    });
    yourChats.push(...recivedChats);
  });
  socket.ev.on("messages.set", (item: any) => {
    // console.log("messages: ", item.messages.slice(0, 4));
    // console.log("messages length: ", item.messages.length);
    const recivedMessages = item.messages.slice(0,5).map((msg: any) => msg);
    yourMessages.push(...recivedMessages);
  });
  socket.ev.on("contacts.set", (item: any) => {
    // console.log("contacts: ", item.contacts.slice(0, 4));
    // console.log("contacts length: ", item.contacts.length);
    const recivedContacts = item.slice(0,5).map((contact: any) => contact);
    yourContacts.push(...recivedContacts);
  });
  // console.log("chats2: ", chats);

  return socket;
};

connect();

// export const connect = async () => {
//   const { state, saveState } = useSingleFileAuthState(
//     path.resolve(__dirname, "..", "cache", "auth_info_multi.json")
//   );
// //   const store = makeInMemoryStore({});
// //   store.readFromFile("./baileys_store.json");
// //   // saves the state to a file every 10s
// //   setInterval(() => {
// //     store.writeToFile("./baileys_store.json");
// //   }, 10_000);
//   const socket = makeWASocket({
//     printQRInTerminal: true,
//     // auth: state
//     auth: state,
//   });
// //   store.bind(socket.ev);
// //   socket.ev.on("contacts.set", () => {
// //     console.log("got contacts -> ", Object.values(store.contacts).slice(0, 20));
// //   });
//   socket.ev.on("connection.update", async (update) => {
//     const { connection, lastDisconnect }: any = update;

//     // if (connection === "close") {
//     //   const shouldReconnect =
//     //     (lastDisconnect?.error as Boom)?.output?.statusCode !==
//     //     DisconnectReason.loggedOut;
//     //   if (shouldReconnect) await connect();
//     // }
//     if (connection === "close") {

//         const reason = new Boom(lastDisconnect.error)?.output.statusCode;
//         console.log("reason: ", reason);
//         switch(reason) {
//             case DisconnectReason.connectionClosed:
//                 console.log("Connection closed. Reconnecting...");
//                 connect();
//             case DisconnectReason.loggedOut:
//                 console.log("session logged out. Reconnecting...");
//                 connect();
//             case DisconnectReason.badSession:
//             console.log("Bad session. Reconnecting...");
//             connect();
//             default: socket.end(new Error(
//                 `Unknown DisconnectReason: ${reason}|${lastDisconnect?.error}`
//               ));
//         }

//     }
//   });
//   socket.ev.on("creds.update", saveState);
//   return socket;
// };

// connect();
