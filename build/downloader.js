"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const e621_1 = __importDefault(require("e621"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const request_1 = __importDefault(require("request"));
const config_json_1 = __importDefault(require("./config.json"));
const e621 = new e621_1.default();
const numberToArray = (num, limit) => {
    const arr = [];
    const maxNum = Math.ceil(num / limit);
    for (let i = 1; i <= maxNum; i++) {
        arr.push(Math.min(num, i * limit) - (i - 1) * limit);
    }
    return arr;
};
const getPostsByTags = async (tags, limit) => {
    const postList = [];
    const pageLimits = numberToArray(limit, 320);
    let pageIndex = 0;
    for (const pageLimit of pageLimits) {
        pageIndex++;
        console.log(`Retrieving Page ${pageIndex}`);
        const posts = await e621.posts.search({ tags, limit: pageLimit, page: pageIndex });
        postList.push(...posts);
        if (posts.length < pageLimit)
            break;
    }
    return postList;
};
const download = async (name, url, ext, dir) => {
    await new Promise((resolve, reject) => {
        request_1.default.head(url, (err, res, body) => {
            if (err)
                reject(err);
            else
                (0, request_1.default)(url)
                    .pipe(fs_1.default.createWriteStream(path_1.default.resolve(dir, `${name}.${ext}`)))
                    .on("close", resolve);
        });
    });
};
exports.default = async (tags, limit, dir) => {
    if (!limit || limit <= 0)
        limit = 10;
    const folder = fs_1.default.readdirSync(dir);
    const posts = (await getPostsByTags(`${config_json_1.default.static_tags} ${tags}`, limit)).filter((a) => !folder.find((b) => b.split(".")[0] === a.id.toString()));
    console.log(`Retrieved ${posts.length} Posts`);
    let downloaded = 0;
    for (const post of posts) {
        await download(post.id.toString(), post.file.url, post.file.ext, dir);
        console.log(`Post ${post.id} Downloaded`);
        downloaded++;
    }
    console.log(`Downloaded ${downloaded.toLocaleString()} Posts`);
};
//# sourceMappingURL=downloader.js.map