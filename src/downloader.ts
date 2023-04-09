import E621 from "e621";
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

const getPostsByTags = async (tags: string, limit: number) => {
    const postList = [];
    const pageLimits = numberToArray(limit, 320);
    let pageIndex = 0;
    for (const pageLimit of pageLimits) {
        pageIndex++;
        console.log(`Retrieving Page ${pageIndex}`);
        const posts = await e621.posts.search({ tags, limit: pageLimit, page: pageIndex });
        postList.push(...posts);
        if (posts.length < pageLimit) break;
    }
    return postList;
};

const download = async (name: string, url: string, ext: string, dir: string) => {
    await new Promise<void>((resolve, reject) => {
        Request.head(url, (err, res, body) => {
            if (err) reject(err);
            else
                Request(url)
                    .pipe(FS.createWriteStream(Path.resolve(dir, `${name}.${ext}`)))
                    .on("close", resolve);
        });
    });
};

export default async (tags: string, limit: number, dir: string) => {
    if (!limit || limit <= 0) limit = 10;
    const folder = FS.readdirSync(dir);
    const posts = (await getPostsByTags(`${Config.static_tags} ${tags}`, limit)).filter((a) => !folder.find((b) => b.split(".")[0] === a.id.toString()));
    console.log(`Retrieved ${posts.length} Posts`);
    let downloaded = 0;
    for (const post of posts) {
        await download(post.id.toString(), post.file.url, post.file.ext, dir);
        console.log(`Post ${post.id} Downloaded`);
        downloaded++;
    }
    console.log(`Downloaded ${downloaded.toLocaleString()} Posts`);
};
