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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
var baileys_1 = __importStar(require("@adiwajshing/baileys"));
var boom_1 = require("@hapi/boom");
var QRcode = require("qrcode");
var fs = require("fs");
var SESSION = "./auth_credentials_nose.json";
var connect = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, state, saveState, fileExistence, socket;
    return __generator(this, function (_b) {
        _a = (0, baileys_1.useSingleFileAuthState)(SESSION), state = _a.state, saveState = _a.saveState;
        console.log("existe?", fs.existsSync(SESSION));
        fileExistence = fs.existsSync(SESSION);
        socket = (0, baileys_1.default)({
            printQRInTerminal: true,
            auth: state,
            getMessage: function (key) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { conversation: "hello" }];
                });
            }); },
        });
        console.log("socket: ", socket);
        socket.ev.on("creds.update", saveState);
        socket.ev.on("connection.update", function (update) { return __awaiter(void 0, void 0, void 0, function () {
            var connection, lastDisconnect, qr, url, reason;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        connection = update.connection, lastDisconnect = update.lastDisconnect, qr = update.qr;
                        console.log("cuERRE: ", qr);
                        console.log("connection: ", connection);
                        if (!qr) return [3 /*break*/, 2];
                        return [4 /*yield*/, QRcode.toDataURL(qr)];
                    case 1:
                        url = _c.sent();
                        console.log("URL", url);
                        _c.label = 2;
                    case 2:
                        if (connection === "close") {
                            reason = (_b = (_a = new boom_1.Boom(lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error)) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode;
                            console.log("reason: ", reason);
                            if (reason === baileys_1.DisconnectReason.connectionClosed) {
                                console.log("connection closed, reconnecting...");
                                (0, exports.connect)();
                            }
                            else if (reason === baileys_1.DisconnectReason.connectionLost) {
                                console.log("connection lost, reconnecting");
                                (0, exports.connect)();
                            }
                            else if (reason === baileys_1.DisconnectReason.connectionReplaced) {
                                console.log("connection replaced");
                                console.log("entre aca");
                                socket.logout();
                            }
                            else if (reason === baileys_1.DisconnectReason.loggedOut) {
                                console.log("device loggedout");
                                if (fileExistence) {
                                    fs.unlink("".concat(SESSION), function (err) {
                                        if (err)
                                            throw err;
                                        console.log("file was deleted");
                                    });
                                }
                                // socket.logout();
                                console.log("pase el socket.logout");
                                (0, exports.connect)();
                            }
                            else if (reason === baileys_1.DisconnectReason.restartRequired) {
                                console.log("restart required. Restarting...");
                                (0, exports.connect)();
                            }
                            else {
                                console.log("entre al else");
                                socket.end(new Error("unknow disconnect reason: ".concat(reason, "|").concat(lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error)));
                            }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        socket.ev.on("messages.upsert", function (m) {
            // console.log("EME: ", m);
            // console.log("m.messages: ", m.messages);
            // console.log("m.messages[0].message: ", m.messages[0].message);
        });
        return [2 /*return*/, socket];
    });
}); };
exports.connect = connect;
(0, exports.connect)();
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
