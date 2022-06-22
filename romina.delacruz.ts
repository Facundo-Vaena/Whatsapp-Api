
import { Boom } from "@hapi/boom";
import path from "path";
import fs from "fs";
import Pino from "pino";
import makeWASocket, {
  AnyMessageContent,
  delay,
  DisconnectReason,
  useSingleFileAuthState,
} from "@adiwajshing/baileys";
// import { useMultiFileAuthState } from "./use_multi_auth_state";
//the store maintains the data of the WA connection in memory
//can be written out to a file & read from it
// const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
// store.readFromFile('./baileys_store_multi.json')
// // save every 10s
// setInterval(() => {
// 	store.writeToFile('./baileys_store_multi.json')
// }, 10_000)

const SESSION = "./auth_credentials_nose.json";
const { state, saveState } = useSingleFileAuthState(SESSION);

// start a connection
const connectSocket = () => {
  console.debug("existe?", fs.existsSync(SESSION));
  //   if (!fs.existsSync(session)) {
  //       file = await downloadFile();
  //       if (file == true) {
  //         connect();
  //       }
  //   }
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    // implement to handle retries
    getMessage: async (key: any) => {
      return {
        conversation: "hello",
      };
    },
  });

  // const sendMessageWTyping = async(msg: AnyMessageContent, jid: string) => {
  // 	await sock.presenceSubscribe(jid)
  // 	await delay(500)

  // 	await sock.sendPresenceUpdate('composing', jid)
  // 	await delay(2000)

  // 	await sock.sendPresenceUpdate('paused', jid)

  // 	await sock.sendMessage(jid, msg)
  // }

  // sock.ev.on('chats.set', item => console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`))
  // sock.ev.on('messages.set', item => console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`))
  // sock.ev.on('contacts.set', item => console.log(`recv ${item.contacts.length} contacts`))

  // sock.ev.on('messages.upsert', async m => {
  // 	console.log(JSON.stringify(m, undefined, 2))

  // 	const msg = m.messages[0]
  // 	if(!msg.key.fromMe && m.type === 'notify') {
  // 		console.log('replying to', m.messages[0].key.remoteJid)
  // 		await sock!.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])
  // 		await sendMessageWTyping({ text: 'Hello there!' }, msg.key.remoteJid)
  // 	}

  // })

  //   sock.ev.on("messages.upsert", (message) => {
  //     console.log(JSON.stringify(message, undefined, 2));

  //     console.log("replying to", message.messages[0].key.remoteJid);
  //     sock.sendMessage(message.messages[0].key.remoteJid!, {
  //       text: "Hello there!",
  //     });
  //   });
  //   sock.ev.on("messages.update", (m: any) => console.log(m));
  //   sock.ev.on("message-receipt.update", (m: any) => console.log(m));
  //   sock.ev.on("presence.update", (m: any) => console.log(m));
  //   sock.ev.on("chats.update", (m: any) => console.log(m));
  //   sock.ev.on("contacts.upsert", (m: any) => console.log(m));
  // listen for when the auth credentials is updated
  sock.ev.on("creds.update", () => saveState);
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect }: any = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect.error)?.output.statusCode;
      if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        connectSocket();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        connectSocket();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "Connection Replaced, Another New SESSION Opened, Please Close Current SESSION First"
        );
        sock.logout();
        // connect();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(
          `Device Logged Out, Please Delete ${SESSION} and Scan Again.`
        );
        fs.unlink(`${SESSION}`, (err) => {
          if (err) throw err;
          console.log("path/file.txt was deleted");
        });
        sock.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        connectSocket();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        connectSocket();
      } else {
        sock.end(
          new Error(
            `Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`
          )
        );
      }
    }
    // const { connection, lastDisconnect }: any = update;
    // if (connection === "close") {
    //   // reconnect if not logged out
    //   // TODO: we need to analize what happen if the user discount the connection from device.
    //   if (
    //     (lastDisconnect.error as Boom)?.output?.statusCode !==
    //     DisconnectReason.loggedOut
    //   ) {
    //     startSock();
    //   } else {
    //     console.log("connection closed");
    //   }
    // }
    // console.log("connection update", update);
  });

  return sock;
};

connectSocket();
