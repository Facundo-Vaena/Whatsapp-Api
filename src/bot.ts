import { connect } from "./connection";

export default async () => {
  const socket = await connect();

  socket.ev.on("messages.upsert", async (message: any) => {
    console.log(JSON.stringify(message, undefined, 2));
    console.log("pruba: ", socket);
    console.log("prueba2: ", socket.ev);
    console.log("replying to", message.messages[0].key.remoteJid);
    // message.messages[0].key.remoteJid!
    console.log("hola hola: ", message.messages);
    // await socket.sendMessage("5491131870041@s.whatsapp.net", {
    //   text: "que pasa si hago esto",
    // });
    // const group = await socket.groupCreate("mi grupo", ["5491131870041@s.whatsapp.net"]);
    // console.log("grupo: ", group);
    // socket.sendMessage(group.id, {text: "Hello!"});
  });
};
