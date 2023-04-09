import E621, { Post } from "e621";
import FS from "fs";
import Path from "path";
import Request from "request";
import Config from "./config.json";

const e621 = new E621();

const numberToArray = (num: number, limit: number): number[] => {
    const arr = [];
    const maxNum = Math.ceil(num / limit);
    for (let i = 1; i <= maxNum; i++) {
        arr.push(Math.min(num, i * limit) - (i - 1) * limit);
    }
    return arr;
};

const getPostsByTags = async (tags: string, limit: number): Promise<Post[]> => {
    const postList = [];
    const pageLimits = numberToArray(limit, 320);
    let pageIndex = 0;
    for (const pageLimit of pageLimits) {
        pageIndex++;
        console.log(`\nRetrieving Page :: ${pageIndex}`);
        const posts = await e621.posts.search({ tags, limit: pageLimit, page: pageIndex });
        postList.push(...posts);
        if (posts.length < pageLimit) break;
    }
    console.log(`\nRetrieved ${postList.length.toLocaleString()} Posts.`);
    return postList;
};

const download = (name: string, url: string, ext: string, folderPath: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        Request.head(url, (err, res, body) => {
            if (err) {
                console.error(`\nFailed to retrieve file metadata for ${name} :: ${err}`);
                reject(err);
                return;
            }

            const filePath = Path.resolve(folderPath, `${name}.${ext}`);
            Request(url).on("error", reject).on("close", resolve).pipe(FS.createWriteStream(filePath));
        });
    });

export default (tags: string, limit: number, folderPath: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        if (!limit || limit <= 0) limit = 10;

        folderPath = Path.resolve(folderPath);

        if (!Path.isAbsolute(folderPath)) {
            console.log(`\n${folderPath} is not an absolute path.`);
            reject(`Invalid path: ${folderPath}`);
        } else if (!FS.existsSync(folderPath)) {
            try {
                FS.mkdirSync(folderPath);
                console.log(`\nFolder created at :: ${folderPath}`);
            } catch (err) {
                console.error(`\nFailed to create folder :: ${err}`);
                reject(err);
            }
        }

        const folder = FS.readdirSync(folderPath);
        let downloaded = 0;
        let postIndex = 0;

        getPostsByTags(`${Config.static_tags} ${tags}`, limit)
            .then((posts) =>
                posts
                    .filter((a) => !folder.find((b) => b.split(".")[0] === a.id.toString()))
                    .reduce<Promise<void>>((previousPromise, post) => {
                        return previousPromise
                            .then(async () => {
                                console.log(`\nPost ${(++postIndex).toLocaleString()} :: ${post.id} Downloading.`);
                                await download(post.id.toString(), post.file.url, post.file.ext, folderPath);
                            })
                            .then(() => {
                                console.log("Download Successful.");
                                downloaded++;
                            })
                            .catch((err) => console.error(`Download Failed :: ${err}`));
                    }, Promise.resolve())
            )
            .then(() => {
                console.log(`\nDownloaded ${downloaded.toLocaleString()} Posts.`);
                resolve();
            })
            .catch((err) => {
                console.error(`\nFailed to retrieve posts :: ${err}`);
                reject(err);
            });
    });
};
