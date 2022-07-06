import { downloadContentFromMessage } from "@adiwajshing/baileys";

// export const downloadMessage = async (msg: any, msgType: any) => {
//   try {
//     const stream = await downloadContentFromMessage(msg, msgType);
//     console.log("streamm: ", stream);
//   } catch (err: any) {
//     console.log("error at message download");
//     throw err;
//   }
// };

export async function downloadMessage(msg: any, msgType: any) {
    //TO DO: Desarrollar. No se si anda y menos como funciona
    let buffer = Buffer.from([])
    try {
        const stream = await downloadContentFromMessage(msg, msgType)
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
    } catch {
        return console.log('error downloading file-message')
    }
    return buffer.toString('base64')
}