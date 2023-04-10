import Readline from "readline";
import E621, { Post } from "e621";
import FS from "fs";
import Path from "path";
import Request from "request";

let Config = { static_tags: "" };

const Interface = Readline.createInterface(process.stdin, process.stdout);
const e621 = new E621();

try {
    Config = JSON.parse(FS.readFileSync(Path.resolve("./config.json"), { encoding: "utf8" }));
} catch (err) {
    console.log(err);
}

const MainMessage = "Hewo bean uwu, welcome to the E621 downloader by DSTitan!";

const numberToArray = (num: number, limit: number): number[] => {
    const arr = [];
    const maxNum = Math.ceil(num / limit);
    for (let i = 1; i <= maxNum; i++) {
        arr.push(Math.min(num, i * limit) - (i - 1) * limit);
    }
    return arr;
};

const getPostsByTags = async (tags: string, limit: number, message: string): Promise<Post[]> => {
    const postList = [];
    const pageLimits = numberToArray(limit, 320);
    let pageIndex = 0;
    for (const pageLimit of pageLimits) {
        pageIndex++;
        console.clear();
        console.log(message + `Pages Retrieved :: ${pageIndex}\nPosts Retrieved :: N/A\nSuccessful :: N/A\nFailed :: N/A`);
        console.log(`\nRetrieving Page :: ${pageIndex}`);
        const posts = await e621.posts.search({ tags, limit: pageLimit, page: pageIndex });
        postList.push(...posts);
        if (posts.length < pageLimit) break;
    }
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

export default (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        console.clear();
        console.log(`${MainMessage}\n\nStatic Tags :: ${Config?.static_tags || "N/A"}\nTags :: N/A\nLimit :: N/A\nDestination :: N/A\n\nPages Retrieved :: N/A\nPosts Retrieved :: N/A\nSuccessful :: N/A\nFailed :: N/A`);

        Interface.question("\nPlease enter the tags you wish to filter by.\n> ", (tags) => {
            console.clear();
            console.log(`${MainMessage}\n\nStatic Tags :: ${Config?.static_tags || "N/A"}\nTags :: ${tags}\nLimit :: N/A\nDestination :: N/A\n\nPages Retrieved :: N/A\nPosts Retrieved :: N/A\nSuccessful :: N/A\nFailed :: N/A`);
            Interface.question("\nEnter the limit of post you wish to retrieve.\n> ", (limitRaw) => {
                let limit = parseInt(limitRaw);
                if (!limit || limit <= 0) limit = 10;

                console.clear();
                console.log(`${MainMessage}\n\nStatic Tags :: ${Config?.static_tags || "N/A"}\nTags :: ${tags}\nLimit :: ${limit}\nDestination :: N/A\n\nPages Retrieved :: N/A\nPosts Retrieved :: N/A\nSuccessful :: N/A\nFailed :: N/A`);

                Interface.question("\nEnter a location where the posts will be downloaded.\n> ", (folderPath) => {
                    folderPath = Path.resolve(folderPath);

                    if (!Path.isAbsolute(folderPath)) {
                        console.log(`\n${folderPath} is not an absolute path.`);
                        reject(`Invalid path: ${folderPath}`);
                    } else if (!FS.existsSync(folderPath)) {
                        try {
                            FS.mkdirSync(folderPath);
                        } catch (err) {
                            console.error(`\nFailed to create folder :: ${err}`);
                            reject(err);
                        }
                    }

                    console.clear();
                    console.log(`${MainMessage}\n\nStatic Tags :: ${Config?.static_tags || "N/A"}\nTags :: ${tags}\nLimit :: ${limit}\nDestination :: ${folderPath}\n\nPages Retrieved :: N/A\nPosts Retrieved :: N/A\nSuccessful :: N/A\nFailed :: N/A`);

                    const folder = FS.readdirSync(folderPath);
                    let downloaded = 0;
                    let failed = 0;
                    let postIndex = 0;
                    let totalPosts = 0;

                    getPostsByTags(`${Config?.static_tags} ${tags}`, limit, `${MainMessage}\n\nStatic Tags :: ${Config?.static_tags || "N/A"}\nTags :: ${tags}\nLimit :: ${limit}\nDestination :: ${folderPath}\n\n`)
                        .then((posts) => {
                            totalPosts = posts.length;
                            return posts
                                .filter((a) => !folder.find((b) => b.split(".")[0] === a.id.toString()))
                                .reduce<Promise<void>>(
                                    (previousPromise, post) =>
                                        previousPromise
                                            .then(async () => {
                                                console.clear();
                                                console.log(`${MainMessage}\n\nStatic Tags :: ${Config?.static_tags || "N/A"}\nTags :: ${tags}\nLimit :: ${limit}\nDestination :: ${folderPath}\n\nPages Retrieved :: ${(totalPosts / 320).toFixed().toLocaleString()}\nPosts Retrieved :: ${totalPosts.toLocaleString()}\nSuccessful :: ${downloaded}\nFailed :: ${failed}`);
                                                console.log(`\nDownloading Post ${(++postIndex).toLocaleString()} / ${totalPosts.toLocaleString()} :: ID ${post.id}`);
                                                await download(post.id.toString(), post.file.url, post.file.ext, folderPath);
                                            })
                                            .then(() => {
                                                downloaded++;
                                            })
                                            .catch((err) => {
                                                failed++;
                                            }),
                                    Promise.resolve()
                                );
                        })
                        .then(() => {
                            console.clear();
                            console.log(`${MainMessage}\n\nStatic Tags :: ${Config?.static_tags || "N/A"}\nTags :: ${tags}\nLimit :: ${limit}\nDestination :: ${folderPath}\n\nPages Retrieved :: ${(totalPosts / 320).toLocaleString()}\nPosts Retrieved :: ${totalPosts.toLocaleString()}\nSuccessful :: ${downloaded}\nFailed :: ${failed}`);
                            console.log(`\nDownloaded ${downloaded.toLocaleString()} Posts.`);
                            Interface.question("\nWhat do you wish to do next, type the number?\n1. Download More     2. Exit\n> ", resolve);
                        })
                        .catch((err) => {
                            console.error(`\nFailed to retrieve posts :: ${err}`);
                            reject(err);
                        });
                });
            });
        });
    });
};
