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
        console.log(`\n\nRetrieving Page :: ${pageIndex}`);
        const posts = await e621.posts.search({ tags, limit: pageLimit, page: pageIndex });
        postList.push(...posts);
        if (posts.length < pageLimit)
            break;
    }
    console.log(`\n\nRetrieved ${postList.length.toLocaleString()} Posts.`);
    return postList;
};
const download = (name, url, ext, folderPath) => new Promise((resolve, reject) => {
    request_1.default.head(url, (err, res, body) => {
        if (err) {
            console.error(`\n\nFailed to retrieve file metadata for ${name} :: ${err}`);
            reject(err);
            return;
        }
        const filePath = path_1.default.resolve(folderPath, `${name}.${ext}`);
        (0, request_1.default)(url).on("error", reject).on("close", resolve).pipe(fs_1.default.createWriteStream(filePath));
    });
});
exports.default = (tags, limit, folderPath) => {
    return new Promise((resolve, reject) => {
        if (!limit || limit <= 0)
            limit = 10;
        folderPath = path_1.default.resolve(folderPath);
        if (!path_1.default.isAbsolute(folderPath)) {
            console.log(`\n\n${folderPath} is not an absolute path.`);
            reject(`Invalid path: ${folderPath}`);
        }
        else if (!fs_1.default.existsSync(folderPath)) {
            try {
                fs_1.default.mkdirSync(folderPath);
                console.log(`\n\nFolder created at :: ${folderPath}`);
            }
            catch (err) {
                console.error(`\n\nFailed to create folder :: ${err}`);
                reject(err);
            }
        }
        const folder = fs_1.default.readdirSync(folderPath);
        let downloaded = 0;
        let postIndex = 0;
        getPostsByTags(`${config_json_1.default.static_tags} ${tags}`, limit)
            .then((posts) => posts
            .filter((a) => !folder.find((b) => b.split(".")[0] === a.id.toString()))
            .reduce((previousPromise, post) => {
            return previousPromise
                .then(async () => {
                console.log(`\n\nPost ${(++postIndex).toLocaleString()} :: ${post.id} Downloading.`);
                await download(post.id.toString(), post.file.url, post.file.ext, folderPath);
            })
                .then(() => {
                console.log("Download Successful.");
                downloaded++;
            })
                .catch((err) => console.error(`Download Failed :: ${err}`));
        }, Promise.resolve()))
            .then(() => {
            console.log(`\n\nDownloaded ${downloaded.toLocaleString()} Posts.`);
            resolve();
        })
            .catch((err) => {
            console.error(`\n\nFailed to retrieve posts :: ${err}`);
            reject(err);
        });
    });
};
//# sourceMappingURL=downloader.js.map