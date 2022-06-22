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
  qrCode: any = "";

  setConnection = async () => {
    return new Promise(async (resolve, reject) => {
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
      // console.log("socket: ", socket);
      this.connection = socket;
      console.log(this.connection.authState.creds, "credenciales");
      socket.ev.on("creds.update", saveState);
      //   const promise = new Promise((resolve, reject) => {
      const scndPromise = await new Promise((resolve, reject) => {
        socket.ev.on("connection.update", async (update) => {
          const { connection, lastDisconnect, qr } = update;
          //   console.log("cuERRE: ", qr);
          //   console.log("connection: ", connection);
          if (qr) {
            const url = await QRcode.toDataURL(qr);
            this.qrCode = url;
            // console.log("URL", url);
            // const qrFileExists = fs.existsSync("../qrcode.json");
            // if (qrFileExists) {
            //   fs.unlink("../qrcode.json", (err: any) => {
            //     if (err) throw err;
            //     console.log("file was deleted");
            //   });
            // }
            // fs.writeFile("qrcode.json", qrCode, (err: any) => {
            //   if (err) reject(err);
            //   console.log("qr created");
            // });
            resolve(this.qrCode);
          }

          if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            // console.log("reason: ", reason);
            if (reason === DisconnectReason.connectionClosed) {
              console.log("connection closed, reconnecting...");
              this.setConnection();
            } else if (reason === DisconnectReason.connectionLost) {
              console.log("connection lost, reconnecting");
              this.setConnection();
            } else if (reason === DisconnectReason.connectionReplaced) {
              console.log("connection replaced");
              //   console.log("entre aca");
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
              //   console.log("pase el socket.logout");
              this.setConnection();
            } else if (reason === DisconnectReason.restartRequired) {
              console.log("restart required. Restarting...");
              this.setConnection();
            } else {
              //   console.log("entre al else");
              socket.end(
                new Error(
                  `unknow disconnect reason: ${reason}|${lastDisconnect?.error}`
                )
              );
            }
          }
        });
      });
      console.log(socket, "socket at creation");

      resolve({ socket, qrCode: scndPromise });
      //   console.log("last qrCode: ", qrCode);
      // return { socket, qrCode: qrCode };
    });
  };
  getContacts = async () => {
    return new Promise(async (resolve, reject) => {
      // const userContacts: any[] = [];
      const scndPromise = await new Promise((resolve, reject) => {
        this.connection.ev.on(
          "contacts.set",
          async ({ contacts }: { contacts: any }) => {
            const recivedContacts = contacts.slice(0, 5).map((contact: any) => {
              console.log("single contact: ", contact);
              return contact;
            });
            // userContacts.push(...recivedContacts);
            this.contacts.push(...recivedContacts);
            resolve(this.contacts);
          }
        );
      });
      resolve(scndPromise);
    });
  };
  getChats = async () => {
    return new Promise(async (resolve, reject) => {
      // const userContacts: any[] = [];
      const scndPromise = await new Promise((resolve, reject) => {
        this.connection.ev.on(
          "chats.set",
          async ({ chats }: { chats: any }) => {
            const recivedChats = chats.slice(0, 5).map((chat: any) => {
              console.log("single contact: ", chat);
              return chat;
            });
            this.chats.push(...recivedChats);
            resolve(this.chats);
          }
        );
      });
      resolve(scndPromise);
    });
  };
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
