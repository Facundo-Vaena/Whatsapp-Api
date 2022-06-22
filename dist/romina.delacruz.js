"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var boom_1 = require("@hapi/boom");
var fs_1 = __importDefault(require("fs"));
var baileys_1 = __importStar(require("@adiwajshing/baileys"));
// import { useMultiFileAuthState } from "./use_multi_auth_state";
//the store maintains the data of the WA connection in memory
//can be written out to a file & read from it
// const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
// store.readFromFile('./baileys_store_multi.json')
// // save every 10s
// setInterval(() => {
// 	store.writeToFile('./baileys_store_multi.json')
// }, 10_000)
var SESSION = "./auth_credentials_nose.json";
var _a = (0, baileys_1.useSingleFileAuthState)(SESSION), state = _a.state, saveState = _a.saveState;
// start a connection
var connectSocket = function () {
    console.debug("existe?", fs_1.default.existsSync(SESSION));
    //   if (!fs.existsSync(session)) {
    //       file = await downloadFile();
    //       if (file == true) {
    //         connect();
    //       }
    //   }
    var sock = (0, baileys_1.default)({
        printQRInTerminal: true,
        auth: state,
        // implement to handle retries
        getMessage: function (key) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        conversation: "hello",
                    }];
            });
        }); },
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
    sock.ev.on("creds.update", function () { return saveState; });
    sock.ev.on("connection.update", function (update) {
        var _a;
        var connection = update.connection, lastDisconnect = update.lastDisconnect;
        if (connection === "close") {
            var reason = (_a = new boom_1.Boom(lastDisconnect.error)) === null || _a === void 0 ? void 0 : _a.output.statusCode;
            if (reason === baileys_1.DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                connectSocket();
            }
            else if (reason === baileys_1.DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...");
                connectSocket();
            }
            else if (reason === baileys_1.DisconnectReason.connectionReplaced) {
                console.log("Connection Replaced, Another New SESSION Opened, Please Close Current SESSION First");
                sock.logout();
                // connect();
            }
            else if (reason === baileys_1.DisconnectReason.loggedOut) {
                console.log("Device Logged Out, Please Delete ".concat(SESSION, " and Scan Again."));
                fs_1.default.unlink("".concat(SESSION), function (err) {
                    if (err)
                        throw err;
                    console.log("path/file.txt was deleted");
                });
                sock.logout();
            }
            else if (reason === baileys_1.DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...");
                connectSocket();
            }
            else if (reason === baileys_1.DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...");
                connectSocket();
            }
            else {
                sock.end(new Error("Unknown DisconnectReason: ".concat(reason, "|").concat(lastDisconnect.error)));
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
