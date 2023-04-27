import React from "react";

import { BiArrowBack, BiCloudDownload, BiCog, BiDownload, BiDownvote, BiEraser, BiHash, BiHome, BiImageAlt, BiImages, BiRefresh, BiRocket, BiSearchAlt, BiStar, BiTrash, BiUpvote, BiX, BiXCircle } from "react-icons/bi";
import { FaGithub, FaPatreon, FaTwitter } from "react-icons/fa";

import FetchModule from "../modules/fetch.module";

import MediaViewerComponent from "../components/mediaviewer.component";
import FormComponent from "../components/forminput.component";
import PaginationComponent from "../components/pagination.component";

import * as Utility from "../utility/utils/utils.utility";

const Section: SectionProps = ({ data, dispatch }) => {
    return (
        <div className="relative bg-secondary rounded-md w-full shadow-01 overflow-hidden">
            <div className="h-full w-full duration-500" style={{ opacity: data.pageOpacity, transform: `translateY(${data.pageOpacity === 0 ? -30 : 0}px)` }}>
                {[<FetchPage data={data} dispatch={dispatch} />, <GalleryPage data={data} dispatch={dispatch} />, <DetailsPage data={data} dispatch={dispatch} />, <SettingsPage data={data} dispatch={dispatch} />][data.activeTab]}
            </div>
        </div>
    );
};

const FetchPage: SectionProps = ({ data, dispatch }) => {
    const activePost = React.useState<Post | null>(null);
    const currentPreviewPage = React.useState<number>(1);
    const currentPreviewPagePosts = React.useState<Post[]>([]);

    React.useEffect(() => {
        const indexOfLastLog = currentPreviewPage[0] * data.config.settings.postPerPreviewPage;
        const indexOfFirstLog = indexOfLastLog - data.config.settings.postPerPreviewPage;
        currentPreviewPagePosts[1](data.fetchOptions.posts.list.slice(indexOfFirstLog, indexOfLastLog));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPreviewPage[0], data.config.settings.postPerPreviewPage, data.fetchOptions.posts.list]);

    return (
        <>
            <div className="grid h-full overflow-y-auto p-10">
                {!data.fetchOptions.posts.errorMessage ? (
                    [
                        <div className="m-auto bg-01 p-5 rounded-lg shadow-01 text-center overflow-hidden">
                            <p className="text text-[25px] f-01 text-white">{data.programData.name}</p>
                            <p className="text text-[17px] f-01 text-white opacity-50">v{data.programData.version}</p>
                            <p className="text text-[16px] text-white opacity-75 mt-2">Is it time to fetch da fluff?</p>
                            <div className="mx-auto button mt-4">
                                <button className="hover02 color-primary drop-shadow-lg" onClick={() => Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 1 }))}>
                                    <span className="button-icon both">
                                        <BiRocket />
                                    </span>
                                    <span className="button-text">Start</span>
                                </button>
                            </div>
                        </div>,
                        <div className="m-auto bg-01 p-5 rounded-lg shadow-01 text-center">
                            <p className="text text-[16px] text-white opacity-75 text-center">
                                Which website would you like to fetch from?
                                <br />
                                E926 is the safe version of E621.
                            </p>
                            <div className="button flex gap-2 justify-center mt-4">
                                <button className="hover02 color-secondary drop-shadow-lg" onClick={() => Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 0 }))}>
                                    <span className="button-icon">
                                        <BiArrowBack />
                                    </span>
                                </button>
                                <button
                                    className="hover02 color-e6 drop-shadow-lg"
                                    onClick={() =>
                                        Utility.PageTransition(dispatch, 500, () => {
                                            dispatch({ type: "update::fetch-step", data: 2 });
                                            dispatch({ type: "update::fetch-website", data: 0 });
                                        })
                                    }>
                                    <span className="button-text">E926</span>
                                </button>
                                <button
                                    className="hover02 color-e6 drop-shadow-lg"
                                    onClick={() =>
                                        Utility.PageTransition(dispatch, 500, () => {
                                            dispatch({ type: "update::fetch-step", data: 2 });
                                            dispatch({ type: "update::fetch-website", data: 1 });
                                        })
                                    }>
                                    <span className="button-text">E621</span>
                                </button>
                            </div>
                        </div>,
                        <div className="m-auto bg-01 p-5 rounded-lg shadow-01 form max-w-5xl w-full">
                            <p className="text text-[20px] f-01 text-white text-center">
                                {data.programData.name} {["E926", "E621"][data.fetchOptions.website]}
                            </p>
                            <FormComponent
                                className="mt-3"
                                type="combo-select"
                                htmlFor="tags"
                                label="Tags"
                                placeholder="The tags to search by"
                                value={data.fetchOptions.tags.map((a: string) => ({ label: a, value: a, search: a }))}
                                onChange={(values: any) => dispatch({ type: "update::fetch-tags", data: values.map((a: any) => a.value?.replace(/ /g, "_").toLowerCase()) })}
                                additionalProps={{
                                    isMulti: true,
                                    closeMenuOnSelect: false,
                                    noOptionsMessage: () => "Add a tag.",
                                    formatCreateLabel: (v: any) => (
                                        <>
                                            Add <code>{v.replace(/ /g, "_").toLowerCase()}</code> tag.
                                        </>
                                    ),
                                }}
                            />
                            <FormComponent
                                className="mt-1"
                                type="number"
                                label="Limit"
                                htmlFor="Limit"
                                value={data.fetchOptions.limit}
                                onChange={(value) => {
                                    let num = parseInt(value.target.value);
                                    dispatch({ type: "update::fetch-limit", data: isNaN(num) ? 1 : num < 1 ? 1 : num > 100000 ? 100000 : num });
                                }}
                            />
                            <FormComponent className="mt-1" type="text" label="Destination" placeholder="Path where the posts will be downloaded ..." htmlFor="destination" value={data.fetchOptions.path} onClick={() => (window as any).program.selectDir().then((result: any) => (result ? dispatch({ type: "update::fetch-path", data: result }) : null))} onChange={() => {}} />
                            <div className="button flex gap-2 justify-center mt-5">
                                <button className="hover02 color-secondary drop-shadow-lg" onClick={() => Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 1 }))}>
                                    <span className="button-icon">
                                        <BiArrowBack />
                                    </span>
                                </button>
                                <button
                                    className={`hover02 color-primary drop-shadow-lg ${!data.fetchOptions.path || data.fetchOptions.limit < 1 || data.fetchOptions.limit > 100000 ? "disabled" : ""}`}
                                    onClick={() => {
                                        if (!data.fetchOptions.path || data.fetchOptions.limit < 1 || data.fetchOptions.limit > 100000) return;
                                        Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 3 }));
                                        FetchModule.GetPostsByTags(data, dispatch).then((value) => {
                                            if (value.error) {
                                                Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-error-message", data: value.message }));
                                                return;
                                            }
                                            dispatch({ type: "update::fetch-posts-retrieved", data: value.posts.length });
                                            if (value.posts.length <= 0) {
                                                Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 7 }));
                                                return;
                                            }
                                            (window as any).program.readDir(data.fetchOptions.path).then(async (folder: string[]) => {
                                                const posts = value.posts.filter((a) => !folder.find((b: any) => b.split(".")[0] === a.id.toString()));
                                                dispatch({ type: "update::fetch-posts", data: posts });
                                                dispatch({ type: "update::fetch-duplicate-posts", data: value.posts.length - posts.length });
                                                if (posts.length <= 0) {
                                                    Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 7 }));
                                                    return;
                                                }
                                                if (data.config.settings.skipPreview) {
                                                    await Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 5 }));
                                                    const downloaded = await FetchModule.StartFetchDownload(data, dispatch);
                                                    Utility.PageTransition(dispatch, 500, async () => {
                                                        dispatch({ type: "update::config", data: await (window as any).program.writeConfig({ "metadata.posts": [...data.config.metadata.posts, ...downloaded], "metadata.totalDownloads": data.config.metadata.totalDownloads + data.fetchOptions.posts.downloadsSuccessful }) });
                                                        dispatch({ type: "update::fetch-step", data: 6 });
                                                    });
                                                } else {
                                                    Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 4 }));
                                                }
                                            });
                                        });
                                    }}>
                                    <span className="button-icon both">
                                        <BiCloudDownload />
                                    </span>
                                    <span className="button-text">Fetch & {data.config.settings.skipPreview ? "Download" : "Preview"}</span>
                                </button>
                            </div>
                        </div>,
                        <div className="m-auto bg-01 p-5 rounded-lg shadow-01 text-center">
                            <p className="text text-[18px] f-01 text-white text-center">Fetching Content</p>
                            <div className="mx-auto w-fit">{[<Utility.SvgE9Bucket w="130px" h="130px" />, <Utility.SvgMilkBucket w="130px" h="130px" />][data.fetchOptions.website]}</div>
                            <p className="text text-[16px] text-white text-center italic opacity-75">Retrieved Page #{data.fetchOptions.posts.pagesRetrieved}</p>
                        </div>,
                        <div className="m-auto bg-01 p-5 rounded-lg shadow-01">
                            <div className="flex flex-wrap justify-center gap-4">
                                {currentPreviewPagePosts[0].map((post) => (
                                    <div key={post.id} className="post-preview relative preview-image rounded-lg overflow-hidden shadow-01 cursor-pointer">
                                        {["webm", "gif"].includes(post.file.ext) && (
                                            <div className="bottom-1 left-1 absolute bg-secondary px-2 rounded-md w-fit shadow-02">
                                                <p className="text text-[14px] text-white text-center uppercase">{post.file.ext}</p>
                                            </div>
                                        )}
                                        <div
                                            className="post-trash top-1 right-1 absolute bg-[#e94560] rounded-md shadow-02"
                                            onClick={() => {
                                                dispatch({ type: "update::fetch-posts-retrieved", data: --data.fetchOptions.posts.postsRetrieved });
                                                dispatch({ type: "update::fetch-posts", data: data.fetchOptions.posts.list.filter((a) => a.id !== post.id) });
                                            }}>
                                            <BiTrash className="text-white text-[20px]" />
                                        </div>
                                        <img src={post.preview.url} alt={post.id.toString()} className="h-36" onClick={() => activePost[1](post)} />
                                    </div>
                                ))}
                            </div>
                        </div>,
                        <div className="m-auto bg-01 p-5 rounded-lg shadow-01 text-center">
                            <p className="text text-[18px] f-01 text-white text-center">Downloading Content</p>
                            <div className="w-fit mx-auto">
                                <Utility.SvgDownload w="100px" h="100px" />
                            </div>
                            <div className="bg-secondary rounded-full w-full h-[19px] overflow-hidden">
                                <div className={`bg-[#e94560] rounded-full h-full duration-500`} style={{ width: `${((data.fetchOptions.posts.downloadsSuccessful + data.fetchOptions.posts.downloadsFailed) / data.fetchOptions.posts.list.length) * 100}%` }}></div>
                            </div>
                            <div className="bg-secondary py-1 px-3 rounded-full mt-4 flex items-center justify-center gap-1">
                                <BiImageAlt className="text-[#e94560] text-[17px]" />
                                <p className="text text-[14px] text-white text-center opacity-75">
                                    {data.fetchOptions.posts.downloadsSuccessful + data.fetchOptions.posts.downloadsFailed} ← {data.fetchOptions.posts.list.length}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="bg-secondary py-1 px-3 rounded-full w-full mt-2 flex items-center justify-center gap-1">
                                    <BiDownload className="text-green-500 text-[17px]" />
                                    <p className="text text-[14px] text-white text-center opacity-75">{data.fetchOptions.posts.downloadsSuccessful}</p>
                                </div>
                                <div className="bg-secondary py-1 px-3 rounded-full w-full mt-2 flex items-center justify-center gap-1">
                                    <BiXCircle className="text-red-500 text-[17px]" />
                                    <p className="text text-[14px] text-white text-center opacity-75">{data.fetchOptions.posts.downloadsFailed}</p>
                                </div>
                            </div>
                            <div className="mx-auto button mt-4">
                                <button
                                    className={`hover02 color-secondary drop-shadow-lg ${data.fetchOptions.isCancelled ? "disabled" : ""}`}
                                    onClick={() => {
                                        if (data.fetchOptions.isCancelled) return;
                                        dispatch({ type: "cancel::fetch", data: true });
                                        FetchModule.isDownloadCancelled = true;
                                    }}>
                                    <span className="button-icon both">
                                        <BiX />
                                    </span>
                                    <span className="button-text">Cancel</span>
                                </button>
                            </div>
                        </div>,
                        <div className="m-auto bg-01 p-5 rounded-lg shadow-01 text-center">
                            <p className="text text-[18px] f-01 text-white text-center">Finished! q(≧▽≦q)</p>
                            <div className="grid gap-2 mt-4" style={{ gridTemplateColumns: `1fr ${data.fetchOptions.posts.duplicatedPosts !== 0 ? "1fr" : ""} ${data.fetchOptions.posts.cancelledPosts !== 0 ? "1fr" : ""}` }}>
                                <div className="bg-secondary py-1 px-3 rounded-full flex items-center justify-center gap-1 whitespace-nowrap">
                                    <BiImageAlt className="text-purple-400 text-[17px]" />
                                    <p className="text text-[14px] text-white text-center opacity-75">{data.fetchOptions.posts.postsRetrieved} Posts</p>
                                </div>
                                {data.fetchOptions.posts.duplicatedPosts !== 0 && (
                                    <div className="bg-secondary py-1 px-3 rounded-full flex items-center justify-center gap-1 whitespace-nowrap">
                                        <BiImages className="text-purple-400 text-[17px]" />
                                        <p className="text text-[14px] text-white text-center opacity-75">{data.fetchOptions.posts.duplicatedPosts} Duplicates</p>
                                    </div>
                                )}
                                {data.fetchOptions.posts.cancelledPosts !== 0 && (
                                    <div className="bg-secondary py-1 px-3 rounded-full flex items-center justify-center gap-1 whitespace-nowrap">
                                        <BiEraser className="text-purple-400 text-[17px]" />
                                        <p className="text text-[14px] text-white text-center opacity-75">{data.fetchOptions.posts.cancelledPosts} Cancelled</p>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="bg-secondary py-1 px-3 rounded-full w-full flex items-center justify-center gap-1">
                                    <BiDownload className="text-green-500 text-[17px]" />
                                    <p className="text text-[14px] text-white text-center opacity-75">{data.fetchOptions.posts.downloadsSuccessful} Successful</p>
                                </div>
                                <div className="bg-secondary py-1 px-3 rounded-full w-full flex items-center justify-center gap-1">
                                    <BiXCircle className="text-red-500 text-[17px]" />
                                    <p className="text text-[14px] text-white text-center opacity-75">{data.fetchOptions.posts.downloadsFailed} Failed</p>
                                </div>
                            </div>
                            <div className="button flex gap-2 justify-center mt-4">
                                <button
                                    className="hover02 color-secondary drop-shadow-lg"
                                    onClick={() => {
                                        Utility.PageTransition(dispatch, 500, () => {
                                            dispatch({ type: "update::fetch-step", data: 0 });
                                            dispatch({ type: "complete::fetch" });
                                            dispatch({ type: "cancel::fetch", data: false });
                                            FetchModule.isDownloadCancelled = false;
                                        });
                                    }}>
                                    <span className="button-icon">
                                        <BiHome />
                                    </span>
                                </button>
                                {/* <button
                                    className="hover02 color-primary drop-shadow-lg"
                                    onClick={() => {
                                        Utility.PageTransition(dispatch, 500, () => {
                                            dispatch({ type: "update::active-tab", data: 1 });
                                            dispatch({ type: "update::fetch-step", data: 2 });
                                            dispatch({ type: "complete::fetch" });
                                            dispatch({ type: "cancel::fetch", data: false });
                                            FetchModule.isDownloadCancelled = false;
                                        });
                                    }}>
                                    <span className="button-icon both">
                                        <BiPhotoAlbum />
                                    </span>
                                    <span className="button-text">Gallery</span>
                                </button> */}
                                <button
                                    className="hover02 color-primary drop-shadow-lg"
                                    onClick={() => {
                                        Utility.PageTransition(dispatch, 500, () => {
                                            dispatch({ type: "update::fetch-step", data: 2 });
                                            dispatch({ type: "complete::fetch" });
                                            dispatch({ type: "cancel::fetch", data: false });
                                            FetchModule.isDownloadCancelled = false;
                                        });
                                    }}>
                                    <span className="button-icon both">
                                        <BiRefresh />
                                    </span>
                                    <span className="button-text">Again</span>
                                </button>
                            </div>
                        </div>,
                        <div className="m-auto bg-01 p-5 rounded-lg shadow-01 text-center">
                            {data.fetchOptions.posts.postsRetrieved <= 0 && <p className="text text-[16px] text-white opacity-75 mt-2">Nobody here but us chickens!</p>}
                            {data.fetchOptions.posts.postsRetrieved > 0 && data.fetchOptions.posts.list.length <= 0 && (
                                <>
                                    <p className="text text-[16px] text-white opacity-75 mt-2">You've already downloaded the posts found.</p>
                                    <div className="bg-secondary py-1 px-3 rounded-full flex items-center mt-2 justify-center gap-1">
                                        <BiImageAlt className="text-[#e94560] text-[17px]" />
                                        <p className="text text-[14px] text-white text-center opacity-75">{data.fetchOptions.posts.postsRetrieved} Posts</p>
                                    </div>
                                </>
                            )}
                            <div className="button flex gap-2 justify-center mt-5">
                                <button
                                    className="hover02 color-secondary drop-shadow-lg"
                                    onClick={() => {
                                        Utility.PageTransition(dispatch, 500, () => {
                                            dispatch({ type: "complete::fetch" });
                                            dispatch({ type: "update::fetch-step", data: 2 });
                                        });
                                    }}>
                                    <span className="button-icon">
                                        <BiArrowBack />
                                    </span>
                                </button>
                            </div>
                        </div>,
                    ][data.fetchOptions.step]
                ) : (
                    <div className="m-auto bg-01 p-5 rounded-lg shadow-01 text-center">
                        <p className="text text-[20px] f-01 text-white text-center">Oops （＞人＜；）</p>
                        <p className="text text-[16px] text-white opacity-75 mt-2">There was an error while processing your request.</p>
                        <p className="text text-[16px] text-white opacity-75 mt-2 bg-secondary rounded-lg px-3 py-2">{data.fetchOptions.posts.errorMessage}</p>

                        <div className="button flex gap-2 justify-center mt-5">
                            <button
                                className="hover02 color-secondary drop-shadow-lg"
                                onClick={() => {
                                    Utility.PageTransition(dispatch, 500, () => {
                                        dispatch({ type: "complete::fetch" });
                                        dispatch({ type: "update::fetch-step", data: 2 });
                                    });
                                }}>
                                <span className="button-icon">
                                    <BiArrowBack />
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {!data.fetchOptions.posts.errorMessage && data.fetchOptions.step === 4 && (
                <>
                    {data.fetchOptions.posts.list.length > data.config.settings.postPerPreviewPage && (
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 button flex gap-3 bg-primary p-2 rounded-md shadow-01">
                            <PaginationComponent changePage={(pageNumber: number) => currentPreviewPage[1](pageNumber)} currentPage={currentPreviewPage[0]} dataPerPage={data.config.settings.postPerPreviewPage} totalData={data.fetchOptions.posts.list.length} />
                        </div>
                    )}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 button flex gap-3 bg-primary p-2 rounded-md shadow-01">
                        <button
                            className="hover02 color-secondary drop-shadow-lg"
                            onClick={() => {
                                Utility.PageTransition(dispatch, 500, () => {
                                    dispatch({ type: "update::fetch-step", data: 2 });
                                    dispatch({ type: "update::fetch-posts", data: [] });
                                });
                            }}>
                            <span className="button-icon">
                                <BiArrowBack />
                            </span>
                        </button>
                        <button
                            className="hover02 color-primary drop-shadow-lg"
                            onClick={async () => {
                                await Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::fetch-step", data: 5 }));
                                const downloaded = await FetchModule.StartFetchDownload(data, dispatch);
                                Utility.PageTransition(dispatch, 500, async () => {
                                    dispatch({ type: "update::config", data: await (window as any).program.writeConfig({ "metadata.posts": [...data.config.metadata.posts, ...downloaded], "metadata.totalDownloads": data.config.metadata.totalDownloads + data.fetchOptions.posts.downloadsSuccessful }) });
                                    dispatch({ type: "update::fetch-step", data: 6 });
                                });
                            }}>
                            <span className="button-icon both">
                                <BiDownload />
                            </span>
                            <span className="button-text">Download</span>
                        </button>
                    </div>
                </>
            )}

            {activePost[0] && (
                <MediaViewerComponent mediaUrl={activePost[0].file.url} mediaType={activePost[0].file.ext === "webm" ? "video" : "image"} onClose={() => activePost[1](null)}>
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                        <div className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                            <BiHash className="text-[23px] text-purple-500" />
                            <p className="text text-[18px] f-01 text-white text-center opacity-75">{activePost[0].id}</p>
                        </div>
                        <div className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                            <BiStar className="text-[23px] text-yellow-500" />
                            <p className="text text-[18px] f-01 text-white text-center opacity-75">{activePost[0].fav_count}</p>
                        </div>
                        <div className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                            <BiUpvote className="text-[23px] text-green-500" />
                            <p className="text text-[18px] f-01 text-white text-center opacity-75">{activePost[0].score.up}</p>
                        </div>
                        <div className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                            <BiDownvote className="text-[23px] text-red-500" />
                            <p className="text text-[18px] f-01 text-white text-center opacity-75">{activePost[0].score.down}</p>
                        </div>
                    </div>
                    {activePost[0].description && (
                        <div className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md">
                            <p className="text text-[16px] text-white opacity-75 mt-2 mb-4 text-center">{activePost[0].description}</p>
                        </div>
                    )}
                    <div>
                        {activePost[0].tags.artist.length > 0 && (
                            <>
                                <p className="text text-[16px] f-01 text-white opacity-75 mt-2 text-center">Artist</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-1">
                                    {activePost[0].tags.artist.map((tag) => (
                                        <div key={tag} className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                                            <p className="text text-[14px] text-white text-center opacity-75">{tag}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {activePost[0].tags.character.length > 0 && (
                            <>
                                <p className="text text-[16px] f-01 text-white opacity-75 mt-2 text-center">Character</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-1">
                                    {activePost[0].tags.character.map((tag) => (
                                        <div key={tag} className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                                            <p className="text text-[14px] text-white text-center opacity-75">{tag}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {activePost[0].tags.species.length > 0 && (
                            <>
                                <p className="text text-[16px] f-01 text-white opacity-75 mt-2 text-center">Species</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-1">
                                    {activePost[0].tags.species.map((tag) => (
                                        <div key={tag} className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                                            <p className="text text-[14px] text-white text-center opacity-75">{tag}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {activePost[0].tags.general.length > 0 && (
                            <>
                                <p className="text text-[16px] f-01 text-white opacity-75 mt-2 text-center">General</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-1">
                                    {activePost[0].tags.general.map((tag) => (
                                        <div key={tag} className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                                            <p className="text text-[14px] text-white text-center opacity-75">{tag}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {activePost[0].tags.lore.length > 0 && (
                            <>
                                <p className="text text-[16px] f-01 text-white opacity-75 mt-2 text-center">Lore</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-1">
                                    {activePost[0].tags.lore.map((tag) => (
                                        <div key={tag} className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                                            <p className="text text-[14px] text-white text-center opacity-75">{tag}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {activePost[0].tags.meta.length > 0 && (
                            <>
                                <p className="text text-[16px] f-01 text-white opacity-75 mt-2 text-center">Meta</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-1">
                                    {activePost[0].tags.meta.map((tag) => (
                                        <div key={tag} className="bg-secondary py-1 px-3 rounded-lg drop-shadow-md flex items-center justify-center gap-1">
                                            <p className="text text-[14px] text-white text-center opacity-75">{tag}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </MediaViewerComponent>
            )}
        </>
    );
};
// TODO Gallery Page
const GalleryPage: SectionProps = ({ data, dispatch }) => {
    const files = React.useState<{ name: string; path: string }[]>([]);
    React.useEffect(() => {
        data.config.settings.galleryPaths.map((path) =>
            (window as any).program.readDir(path).then((folder: any) => {
                files[1]([...files[0], ...folder.map((file: any) => ({ name: file, path }))]);
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <div className="grid h-full overflow-y-auto p-10">
                {data.config.settings.galleryPaths.length < 1 ? (
                    <div className="m-auto bg-01 p-5 rounded-lg shadow-01">
                        <p className="text text-[19px] f-01 text-white text-center">( •̀ ω •́ )✧</p>
                        <p className="text text-[16px] text-white opacity-75 mt-2 text-center">Looks like you haven't added any folders.</p>
                        <div className="grid button mt-4">
                            <button className="hover02 mx-auto color-secondary drop-shadow-lg" onClick={() => Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::active-tab", data: 3 }))}>
                                <span className="button-icon both">
                                    <BiCog />
                                </span>
                                <span className="button-text">Settings</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="m-auto bg-01 p-5 rounded-lg shadow-01">
                        <div className="flex flex-wrap justify-center gap-4">
                            {files[0].map((file, i) => (
                                <div key={i} className="post-preview relative preview-image rounded-lg overflow-hidden shadow-01 cursor-pointer">
                                    <img src={`file://${file.path}\\${file.name}`} alt={file.name} className="h-36" onClick={() => {}} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-primary p-2 rounded-md shadow-01">
                <div className="flex gap-2 form">
                    <FormComponent type="text" placeholder="Search by tags ..." />
                    <div className="button flex gap-2">
                        <button className="hover02 h-full color-primary drop-shadow-lg" onClick={() => {}}>
                            <span className="button-icon">
                                <BiSearchAlt />
                            </span>
                        </button>
                        <button className="hover02 h-full color-secondary drop-shadow-lg" onClick={() => {}}>
                            <span className="button-icon">
                                <BiCog />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
const DetailsPage: SectionProps = ({ data, dispatch }) => {
    return (
        <>
            <div className="grid h-full overflow-y-auto p-10">
                <div className="m-auto">
                    <div className="mx-auto w-fit bg-01 p-5 rounded-lg shadow-01 form text-center">
                        <p className="text text-[25px] f-01 text-white">{data.programData.name}</p>
                        <p className="text text-[16px] text-white opacity-75">{data.programData.description}</p>
                        <div className="my-2"></div>
                        <code className="text text-[20px] f-01 text-white">Version {data.programData.version}</code>
                        <div className="my-2"></div>
                        <p className="text text-[16px] text-white opacity-75">
                            You've made a total of <code>{data.config.metadata.totalDownloads.toLocaleString()}</code> downloads.
                        </p>
                    </div>
                    <div className="mx-auto mt-5 w-fit bg-01 p-5 rounded-lg shadow-01 form text-center">
                        <p className="text text-[16px] text-white opacity-75">More tabs n stuff may be added soon!</p>
                    </div>
                    <div className="mx-auto mt-5 w-fit bg-01 p-5 rounded-lg shadow-01 form text-center">
                        <div className="button flex flex-wrap justify-center gap-3">
                            <button
                                className="hover02 bg-black drop-shadow-lg"
                                onClick={() => {
                                    (window as any).program.openLink("https://github.com/DSTitan");
                                }}>
                                <span className="button-icon both">
                                    <FaGithub />
                                </span>
                                <span className="button-text">Github</span>
                            </button>
                            <button
                                className="hover02 bg-[#00acee] drop-shadow-lg"
                                onClick={() => {
                                    (window as any).program.openLink("https://twitter.com/DeathStormTitan");
                                }}>
                                <span className="button-icon both">
                                    <FaTwitter />
                                </span>
                                <span className="button-text">Twitter</span>
                            </button>{" "}
                            <button
                                className="hover02 bg-[#FF424D] drop-shadow-lg"
                                onClick={() => {
                                    (window as any).program.openLink("https://www.patreon.com/DSTitan");
                                }}>
                                <span className="button-icon both">
                                    <FaPatreon />
                                </span>
                                <span className="button-text">Patreon</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
const SettingsPage: SectionProps = ({ data, dispatch }) => {
    return (
        <>
            <div className="h-full overflow-y-auto p-10">
                <div className="w-full min-h-full bg-01 p-5 rounded-lg shadow-01 form">
                    <>
                        <p className="text text-[20px] f-01 text-white">Settings</p>
                        <p className="text text-[16px] text-white opacity-75">Configure the provided settings of the program to your liking.</p>
                    </>
                    <div className="w-full h-1 bg-secondary rounded-sm my-4 opacity-75"></div>
                    <>
                        <p className="text text-[16px] f-01 text-white opacity-80">Static Tags</p>
                        <p className="text text-[16px] text-white opacity-75">
                            These tags are automatically applied on every
                            <strong className="text-[#e94560] opacity-100 cursor-pointer" onClick={() => dispatch({ type: "update::active-tab", data: 0 })}>
                                {" fetch request "}
                            </strong>
                            made, used for tags you don't want to repeatedly enter. Tags that start with a hyphen <code>-</code> are considered blacklisted, which means that any posts with such tags will not be retrieved.
                        </p>
                        <FormComponent
                            className="mt-1"
                            type="combo-select"
                            htmlFor="tags"
                            label="Default Tags"
                            placeholder="Tags applied for both e621 and e926"
                            value={data.config.settings.staticTags.default.map((a: string) => ({ label: a, value: a, search: a }))}
                            onChange={async (values: any) => dispatch({ type: "update::config", data: await (window as any).program.writeConfig({ "settings.staticTags.default": values.map((a: any) => a.value?.replace(/ /g, "_").toLowerCase()) }) })}
                            additionalProps={{
                                isMulti: true,
                                closeMenuOnSelect: false,
                                noOptionsMessage: () => "Add a tag.",
                                formatCreateLabel: (v: any) => (
                                    <>
                                        Add <code>{v.replace(/ /g, "_").toLowerCase()}</code> tag.
                                    </>
                                ),
                            }}
                        />
                        <FormComponent
                            className="mt-1"
                            type="combo-select"
                            htmlFor="tags"
                            label="E926 Tags"
                            placeholder="Tags applied for e926"
                            value={data.config.settings.staticTags.e926.map((a: string) => ({ label: a, value: a, search: a }))}
                            onChange={async (values: any) => dispatch({ type: "update::config", data: await (window as any).program.writeConfig({ "settings.staticTags.e926": values.map((a: any) => a.value?.replace(/ /g, "_").toLowerCase()) }) })}
                            additionalProps={{
                                isMulti: true,
                                closeMenuOnSelect: false,
                                noOptionsMessage: () => "Add a tag.",
                                formatCreateLabel: (v: any) => (
                                    <>
                                        Add <code>{v.replace(/ /g, "_").toLowerCase()}</code> tag.
                                    </>
                                ),
                            }}
                        />
                        <FormComponent
                            className="mt-1"
                            type="combo-select"
                            htmlFor="tags"
                            label="E621 Tags"
                            placeholder="Tags applied for e621"
                            value={data.config.settings.staticTags.e621.map((a: string) => ({ label: a, value: a, search: a }))}
                            onChange={async (values: any) => dispatch({ type: "update::config", data: await (window as any).program.writeConfig({ "settings.staticTags.e621": values.map((a: any) => a.value?.replace(/ /g, "_").toLowerCase()) }) })}
                            additionalProps={{
                                isMulti: true,
                                closeMenuOnSelect: false,
                                noOptionsMessage: () => "Add a tag.",
                                formatCreateLabel: (v: any) => (
                                    <>
                                        Add <code>{v.replace(/ /g, "_").toLowerCase()}</code> tag.
                                    </>
                                ),
                            }}
                        />
                    </>
                    {/* <div className="w-full h-1 bg-secondary rounded-sm my-4 opacity-75"></div> */}
                    {/* <div className="w-full h-1 bg-secondary rounded-sm my-4 opacity-75"></div>
                    <>
                        <p className="text text-[16px] f-01 text-white opacity-80">Gallery Folders</p>
                        <p className="text text-[16px] text-white opacity-75">
                            Posts downloaded within these folders will show in the
                            <strong className="text-[#e94560] opacity-100 cursor-pointer" onClick={() => dispatch({ type: "update::active-tab", data: 1 })}>
                                {" gallery tab "}
                            </strong>
                            once they are valid.
                        </p>
                        {data.config.settings.galleryPaths.map((path, i) => (
                            <div key={i} className="flex mt-2 gap-2">
                                <FormComponent className="w-full pointer-events-none" type="text" value={path} onChange={() => {}} />
                                <div className="button">
                                    <button
                                        className="hover02 color-danger drop-shadow-lg h-full"
                                        onClick={async () => {
                                            data.config.settings.galleryPaths.splice(i, 1);
                                            dispatch({ type: "update::config", data: await (window as any).program.writeConfig({ "settings.galleryPaths": data.config.settings.galleryPaths }) });
                                        }}>
                                        <span className="button-icon">
                                            <BiX />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="button mt-2">
                            <button
                                className="hover02 color-primary drop-shadow-lg"
                                onClick={async () => {
                                    const result = await (window as any).program.selectDir();
                                    if (!result) return;
                                    data.config.settings.galleryPaths.push(result);
                                    dispatch({ type: "update::config", data: await (window as any).program.writeConfig({ "settings.galleryPaths": Utility.RemoveDuplicates(data.config.settings.galleryPaths) }) });
                                }}>
                                <span className="button-icon both">
                                    <BiFolderPlus />
                                </span>
                                <span className="button-text whitespace-nowrap">Add Folder</span>
                            </button>
                        </div>
                    </> */}
                </div>
            </div>
        </>
    );
};

export default Section;
