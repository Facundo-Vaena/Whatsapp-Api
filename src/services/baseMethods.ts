export const findContacts = async (instanceId: string) => {
    const instance = WhatsappInstances[instanceId];
    const userContacts = await instance?.getContacts();
    console.log("contacts from method: ", userContacts);
    return userContacts;
};

export const findChats = async (instanceId: string) => {
    const instance = WhatsappInstances[instanceId];
    const userChats = await instance?.getChats();
    console.log("chats from method: ", userChats);
    return userChats;
};