import Axios from "axios";

import * as Utility from "../utility/utils/utils.utility";

const GetPostsByTags = async (data: ReducerState, dispatch: React.Dispatch<ReducerAction>): Promise<{ error: boolean; message: string; posts: Post[] }> => {
    const pageLimits = Utility.NumberToArray(data.fetchOptions.limit, 320);

    let response: any = { error: false, message: "", posts: [] };
    let lastPostID = null;
    let pageIndex = 0;

    for (const pageLimit of pageLimits) {
        const axios = await Axios.get(`https://${data.fetchOptions.website === 0 ? "e926" : "e621"}.net/posts.json?limit=${pageLimit}&tags=${data.config.settings.staticTags.default.join("+")}+${data.fetchOptions.website === 0 ? data.config.settings.staticTags.e926.join("+") : data.config.settings.staticTags.e621.join("+")}+${data.fetchOptions.tags.join("+")}${lastPostID ? `&page=b${lastPostID}` : ""}`).catch((err) => {
            response.error = true;
            response.message = err.message;
        });

        if (!axios) break;
        if (axios.status !== 200) {
            response.error = true;
            response.message = axios.statusText;
            break;
        }

        let posts: Post[] = axios.data.posts;

        if (!posts) {
            response.error = true;
            response.message = "Posts could not be retrieved.";
            break;
        }

        response.posts.push(...posts);

        dispatch({ type: "update::fetch-pages-retrieved", data: ++pageIndex });

        if (posts.length < pageLimit || lastPostID === posts[posts.length - 1].id) break;

        lastPostID = posts[posts.length - 1].id;
    }

    return response;
};

const StartFetchDownload = async (data: ReducerState, dispatch: React.Dispatch<ReducerAction>): Promise<PostMetadata[]> => {
    const downloaded: PostMetadata[] = [];
    for (let post of data.fetchOptions.posts.list) {
        if (Module.isDownloadCancelled) {
            dispatch({ type: "update::fetch-cancelled-posts", data: data.fetchOptions.posts.list.length - (data.fetchOptions.posts.downloadsFailed + data.fetchOptions.posts.downloadsSuccessful) });
            break;
        }
        try {
            await (window as any).program.downloadFile(post.file.url, data.fetchOptions.path, `${post.id.toString()}.${post.file.ext}`);
        } catch {
            dispatch({ type: "update::fetch-downloads-failed", data: ++data.fetchOptions.posts.downloadsFailed });
            continue;
        }
        dispatch({ type: "update::fetch-downloads-successful", data: ++data.fetchOptions.posts.downloadsSuccessful });
        downloaded.push({
            id: post.id,
            website: data.fetchOptions.website,
            original: post.file.url,
            preview: post.preview.url,
            description: post.description,
            upVotes: post.score.up,
            downVotes: post.score.down,
            favCount: post.fav_count,
            rating: post.rating,
            sources: post.sources,
            isFavorited: false,
            tags: post.tags,
        });
    }
    return downloaded;
};

const Module = { isDownloadCancelled: false, GetPostsByTags, StartFetchDownload };

export default Module;
