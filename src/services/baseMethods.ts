import { WhatsappInstance } from "../folder/whatsapp";

export const findContacts = async (instanceId: string) => {
    const instance = WhatsappInstances[instanceId];
    const userContacts = await instance.contacts;
    // const userContacts = await instance?.getContacts();
    // console.log("contacts from method: ", userContacts);
    return userContacts;
};

export const findChats = async (instanceId: string) => {
    const instance = WhatsappInstances[instanceId];
    const userChats = await instance.chats;
    // const userChats = await instance?.getChats();
    // console.log("chats from method: ", userChats);
    return userChats;
};

export const getData = async (instanceId: string) => {
    const { contacts, chats, messages } = await WhatsappInstances[instanceId];
    console.log("contactsss: ", contacts[0]);
    console.log("chatss: ", chats[0]);
    console.log("messagesss: ", messages);
    return { contacts, chats, messages };
}

export const createConnection = async () => {
    const connection = new WhatsappInstance();
    await connection.init();
    const { registrationId } = connection.connection.authState.creds;   

    WhatsappInstances[registrationId] = connection;

    return registrationId;
}

export const getQrCode = async (instanceId: string) => {
    const qr = await WhatsappInstances[instanceId]?.qrCode;
    return qr;
}