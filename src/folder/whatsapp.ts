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

export class WhatsappInstance {
  connection: any = {};
  contacts: any[] = [];
  chats: any[] = [];
  messages: any[] = [];
  qrCode: any = "no";

  async init() {
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
    this.connection = socket;
    if (this.connection.authState.creds)
      socket.ev.on("creds.update", saveState);
    this.setConnection();
    console.log("thiss: ", this);
    return this;
  }

  setConnection() {
    // return await new Promise(async (resolve, reject) => {
    // const { state, saveState }: any = useSingleFileAuthState(SESSION);
    // console.log("existe?", fs.existsSync(SESSION));
    // const fileExistence = fs.existsSync(SESSION);
    // const socket = makeWASocket({
    //   printQRInTerminal: true,
    //   auth: state,
    //   getMessage: async (key: any) => {
    //     return { conversation: "hello" };
    //   },
    // });
    // this.connection = socket;
    // console.log(this.connection.authState.creds, "credenciales");
    // const scndPromise = await new Promise((resolve, reject) => {

    const socket = this.connection;
    console.log("setConnection socket: ", socket);
    const fileExistence = fs.existsSync(SESSION);

    // const fstPromise = new Promise((resolve, reject) => {
    socket.ev.on("connection.update", async (update: any) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        console.log("entre al if hay qr");
        const url = await QRcode.toDataURL(qr);
        this.qrCode = url;
        console.log("this.qrCode after update: ", this.qrCode);
        // resolve(this.qrCode);
      }

      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        if (reason === DisconnectReason.connectionClosed) {
          console.log("connection closed, reconnecting...");
          this.init();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("connection lost, reconnecting");
          this.init();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log("connection replaced");
          socket.logout();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log("device loggedout");
          if (fs.existsSync(SESSION)) {
            fs.unlink(`${SESSION}`, (err: any) => {
              if (err) throw err;
              console.log("file was deleted");
            });
          }
          this.init();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("restart required. Restarting...");
          this.init();
        } else {
          socket.end(
            new Error(
              `unknow disconnect reason: ${reason}|${lastDisconnect?.error}`
            )
          );
        }
      }
    });
    // });
    // const scndPromise = new Promise((resolve, reject) => {

    this.connection.ev.on(
      "contacts.set",
      async ({ contacts }: { contacts: any }) => {
        const recivedContacts = contacts.map((contact: any) => contact);
        // userContacts.push(...recivedContacts);
        this.contacts.push(...recivedContacts);
        // resolve(this.contacts);
      }
    );
    this.connection.ev.on(
      "chats.set",
      async ({ chats }: { chats: any }) => {
        const recivedChats = chats.map((chat: any) => chat);
        // userContacts.push(...recivedContacts);
        this.chats.push(...recivedChats);
        // resolve(this.contacts);
      }
    );
    this.connection.ev.on(
      "mesagges.set",
      async ({ messages }: { messages: any }) => {
        const recivedMessages = messages.map((message: any) => message);
        // userContacts.push(...recivedContacts);
        this.messages.push(...recivedMessages);
        // resolve(this.contacts);
      }
    );  
    this.connection.ev.on("messages.upsert", (m: any) => {
      console.log("msg upsert: ", m)
      console.log("m[0].message", m[0].message);
    });
    this.connection.ev.on("messages.update", (m: any) => {console.log("msg update: ", m)});
    // });
    // const result = await Promise.all([fstPromise, scndPromise])
    // console.log("promise all result: ", result);
    // resolve({ socket, qrCode: scndPromise });
    // resolve({socket, qrCode: result[1]});
    // });
  }
  // getContacts = async () => {
  //   return new Promise(async (resolve, reject) => {
  //     const scndPromise = await new Promise((resolve, reject) => {
  //       this.connection.ev.on(
  //         "contacts.set",
  //         async ({ contacts }: { contacts: any }) => {
  //           const recivedContacts = contacts.slice(0, 5).map((contact: any) => {
  //             console.log("single contact: ", contact);
  //             return contact;
  //           });
  //           // userContacts.push(...recivedContacts);
  //           this.contacts.push(...recivedContacts);
  //           resolve(this.contacts);
  //         }
  //       );
  //     });
  //     resolve(scndPromise);
  //   });
  // };
  // getChats = async () => {
  //   return new Promise(async (resolve, reject) => {
  //     // const userContacts: any[] = [];
  //     const scndPromise = await new Promise((resolve, reject) => {
  //       this.connection.ev.on(
  //         "chats.set",
  //         async ({ chats }: { chats: any }) => {
  //           const recivedChats = chats.slice(0, 5).map((chat: any) => {
  //             console.log("single contact: ", chat);
  //             return chat;
  //           });
  //           // const recivedChats = chats.filter((chat: any) => {
  //           //   console.log("single contact: ", chat);
  //           //   const { id } = chat;
  //           //   const passOrNot =
  //           //     id === "5491131071904@s.whatsapp.net" ||
  //           //     id === "5492216764046@s.whatsapp.net" ||
  //           //     id === "5491140583947@s.whatsapp.net" ||
  //           //     id === "5491155085594@s.whatsapp.net";
  //           //   return passOrNot;
  //           // });
  //           this.chats.push(...recivedChats);
  //           resolve(this.chats);
  //         }
  //       );
  //     });
  //     resolve(scndPromise);
  //   });
  // };
}

// export const setConnection = async () => {
//   return new Promise(async (resolve, reject) => {
//     const { state, saveState }: any = useSingleFileAuthState(SESSION);
//     let qrCode: any;
//     console.log("existe?", fs.existsSync(SESSION));
//     // const fileExistence = fs.existsSync(SESSION);
//     const socket = makeWASocket({
//       printQRInTerminal: true,
//       auth: state,
//       getMessage: async (key: any) => {
//         return { conversation: "hello" };
//       },
//     });
//     // console.log("socket: ", socket);

//     socket.ev.on("creds.update", saveState);
//     //   const promise = new Promise((resolve, reject) => {
//     const scndPromise = await new Promise((resolve, reject) => {socket.ev.on("connection.update", async (update) => {
//       const { connection, lastDisconnect, qr } = update;
//       //   console.log("cuERRE: ", qr);
//       //   console.log("connection: ", connection);

//       if (qr) {
//         const url = await QRcode.toDataURL(qr);
//         qrCode = url;
//         // console.log("URL", url);
//         console.log("current qrCode: ", qrCode);
//         // const qrFileExists = fs.existsSync("../qrcode.json");
//         // if (qrFileExists) {
//         //   fs.unlink("../qrcode.json", (err: any) => {
//         //     if (err) throw err;
//         //     console.log("file was deleted");
//         //   });
//         // }
//         // fs.writeFile("qrcode.json", qrCode, (err: any) => {
//         //   if (err) reject(err);
//         //   console.log("qr created");
//         // });
//         resolve(qrCode);
//       }

//       if (connection === "close") {
//         const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
//         // console.log("reason: ", reason);
//         if (reason === DisconnectReason.connectionClosed) {
//           console.log("connection closed, reconnecting...");
//           setConnection();
//         } else if (reason === DisconnectReason.connectionLost) {
//           console.log("connection lost, reconnecting");
//           setConnection();
//         } else if (reason === DisconnectReason.connectionReplaced) {
//           console.log("connection replaced");
//           //   console.log("entre aca");
//           socket.logout();
//         } else if (reason === DisconnectReason.loggedOut) {
//           console.log("device loggedout");
//           // if (fileExistence) {
//             fs.unlink(`${SESSION}`, (err: any) => {
//               if (err) throw err;
//               console.log("file was deleted");
//             });
//           // }
//           // socket.logout();
//           //   console.log("pase el socket.logout");
//           setConnection();
//         } else if (reason === DisconnectReason.restartRequired) {
//           console.log("restart required. Restarting...");
//           setConnection();
//         } else {
//           //   console.log("entre al else");
//           socket.end(
//             new Error(
//               `unknow disconnect reason: ${reason}|${lastDisconnect?.error}`
//             )
//           );
//         }
//       }
//     })
//     });
//     console.log(socket, "socket at creation");
//     resolve({socket, qrCode: scndPromise});
//     //   console.log("last qrCode: ", qrCode);
//     // return { socket, qrCode: qrCode };
//   });
// };

// export const getChats = async (socket: any) => {
//   let chats;

//   socket.ev.on("chats.set", async ({ chats }: { chats: any }) => {
//     const recivedChats = chats.map((chat: any) => {
//       return {
//         ...chat,
//         messages: [],
//       };
//     });
//     chats.push(...recivedChats);
//   });
//   return chats;
// };

// export const getContacts = async (socket: any) => {
//   let userContacts;
//   console.log("socket for getContacts: ", socket);
//   socket.ev.on("contacts.set", async ({ contacts }: { contacts: any }) => {
//     const recivedContacts = contacts.slice(0, 5).map((contact: any) => {
//       return contact;
//     });
//     userContacts.push(...recivedContacts);
//   });
//   return userContacts;
// };
