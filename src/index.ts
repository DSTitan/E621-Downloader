import PromptSync from "prompt-sync";

import Downloader from "./downloader";

const Prompt = PromptSync();

const Tags = Prompt("Hewo bean uwu, welcome to the E621 downloader by DSTitan!\n\nPlease enter the tags you wish to filter by.\n> ");
const Limit = parseInt(Prompt("\nEnter the limit of post you wish to retrieve.\n> "));
const Path = Prompt("\nEnter a location where the posts will be downloaded.\n> ");

Downloader(Tags, Limit, Path)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
