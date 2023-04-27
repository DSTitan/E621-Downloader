type Post = {
    id: number;
    created_at: string;
    updated_at: string;
    file: {
        width: number;
        height: number;
        ext: string;
        size: number;
        md5: string;
        url: string;
    };
    preview: {
        width: number;
        height: number;
        url: string;
    };
    sample: {
        has: boolean;
        height: number;
        width: number;
        url: string;
        alternates: Record<string, never>;
    };
    score: {
        up: number;
        down: number;
        total: number;
    };
    tags: {
        general: string[];
        species: string[];
        copyright: string[];
        character: string[];
        artist: string[];
        invalid: never[];
        lore: never[];
        meta: string[];
    };
    locked_tags: never[];
    change_seq: number;
    flags: {
        pending: boolean;
        flagged: boolean;
        note_locked: boolean;
        status_locked: boolean;
        rating_locked: boolean;
        comment_disabled: boolean;
        deleted: boolean;
    };
    rating: string;
    fav_count: number;
    sources: string[];
    pools: never[];
    relationships: {
        parent_id: null;
        has_children: boolean;
        has_active_children: boolean;
        children: never[];
    };
    approver_id: null;
    uploader_id: number;
    description: string;
    comment_count: number;
    is_favorited: boolean;
    has_notes: boolean;
    duration: null;
};
type PostMetadata = {
    id: number;
    website: number;
    original: string;
    preview: string;
    description: string;
    upVotes: number;
    downVotes: number;
    favCount: number;
    rating: string;
    sources: string[];
    isFavorited: boolean;
    tags: {
        general: string[];
        copyright: string[];
        species: string[];
        character: string[];
        artist: string[];
        invalid: never[];
        lore: never[];
        meta: string[];
    };
};

type ReducerState = {
    config: {
        settings: {
            staticTags: {
                default: string[];
                e621: string[];
                e926: string[];
            };
            postPerPreviewPage: number;
            skipPreview: boolean;
            galleryPaths: string[];
        };
        metadata: {
            totalDownloads: number;
            posts: PostMetadata[];
        };
    };
    programData: {
        name: string;
        version: string;
        description: string;
    };
    activeTab: number;
    pageOpacity: number;
    fetchOptions: {
        step: number;
        website: number;
        tags: string[];
        limit: number;
        path: string;
        isCancelled: boolean;
        posts: {
            list: Post[];
            pagesRetrieved: number;
            postsRetrieved: number;
            duplicatedPosts: number;
            cancelledPosts: number;
            downloadsSuccessful: number;
            downloadsFailed: number;
            errorMessage: string | null;
        };
    };
};

type ReducerAction = {
    type: "initilize" | "update::opacity" | "update::active-tab" | "update::fetch-step" | "update::fetch-website" | "update::fetch-tags" | "update::fetch-limit" | "update::fetch-path" | "update::fetch-downloaded" | "update::fetch-posts" | "update::fetch-error-message" | "update::fetch-pages-retrieved" | "update::fetch-posts-retrieved" | "update::fetch-duplicate-posts" | "update::fetch-cancelled-posts" | "update::fetch-downloads-successful" | "update::fetch-downloads-failed" | "complete::fetch" | "cancel::fetch" | "update::config";
    data?: any;
};

type PostRequestState = {
    list: Post[];
    pagesRetrieved: number;
    postsRetrieved: number;
    downloadsSuccessful: number;
    downloadsFailed: number;
    errorMessage: string | null;
};

type SectionProps = React.FC<{
    data: ReducerState;
    dispatch: React.Dispatch<ReducerAction>;
}>;
