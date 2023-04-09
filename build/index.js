"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const downloader_1 = __importDefault(require("./downloader"));
const Prompt = (0, prompt_sync_1.default)();
const Tags = Prompt("Hewo bean uwu, welcome to the E621 downloader by DSTitan!\n\nPlease enter the tags you wish to filter by.\n> ");
const Limit = parseInt(Prompt("\nEnter the limit of post you wish to retrieve.\n> ", { value: "50" }));
const Path = Prompt("\nEnter a location where the posts will be downloaded.\n> ", { value: "./downloads" });
(0, downloader_1.default)(Tags, Limit, Path)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
//# sourceMappingURL=index.js.map