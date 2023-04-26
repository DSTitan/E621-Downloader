import Dot from "dot-object";

import Data from "../utility/utils/program.data";

const Reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
    let main: ReducerState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case "initilize": {
            main = {
                config: action.data,
                programData: Data,
                activeTab: 0,
                pageOpacity: 1,
                fetchOptions: {
                    step: 0,
                    website: 0,
                    tags: [],
                    limit: 10,
                    path: "",
                    isCancelled: false,
                    posts: {
                        list: [],
                        pagesRetrieved: 0,
                        postsRetrieved: 0,
                        duplicatedPosts: 0,
                        cancelledPosts: 0,
                        downloadsSuccessful: 0,
                        downloadsFailed: 0,
                        errorMessage: null,
                    },
                },
            };
            break;
        }
        case "update::config":
            if (action.data === undefined) break;
            Dot.set("config", action.data, main);
            break;
        case "update::opacity":
            if (action.data === undefined) break;
            Dot.set("pageOpacity", action.data, main);
            break;
        case "update::active-tab":
            if (action.data === undefined) break;
            Dot.set("activeTab", action.data, main);
            break;
        case "update::fetch-step":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.step", action.data, main);
            break;
        case "update::fetch-website":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.website", action.data, main);
            break;
        case "update::fetch-tags":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.tags", action.data, main);
            break;
        case "update::fetch-limit":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.limit", action.data, main);
            break;
        case "update::fetch-path":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.path", action.data, main);
            break;
        case "update::fetch-posts":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.posts.list", action.data, main);
            break;
        case "update::fetch-error-message":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.posts.errorMessage", action.data, main);
            break;
        case "update::fetch-pages-retrieved":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.posts.pagesRetrieved", action.data, main);
            break;
        case "update::fetch-posts-retrieved":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.posts.postsRetrieved", action.data, main);
            break;
        case "update::fetch-duplicate-posts":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.posts.duplicatedPosts", action.data, main);
            break;
        case "update::fetch-cancelled-posts":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.posts.cancelledPosts", action.data, main);
            break;

        case "update::fetch-downloads-successful":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.posts.downloadsSuccessful", action.data, main);
            break;
        case "update::fetch-downloads-failed":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.posts.downloadsFailed", action.data, main);
            break;
        case "complete::fetch":
            Dot.set(
                "fetchOptions.posts",
                {
                    list: [],
                    pagesRetrieved: 0,
                    postsRetrieved: 0,
                    duplicatedPosts: 0,
                    cancelledPosts: 0,
                    downloadsSuccessful: 0,
                    downloadsFailed: 0,
                    errorMessage: null,
                },
                main
            );
            break;
        case "cancel::fetch":
            if (action.data === undefined) break;
            Dot.set("fetchOptions.isCancelled", action.data, main);
            break;
    }
    return main;
};

export default Reducer;
