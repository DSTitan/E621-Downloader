import React from "react";
import ReactDOM from "react-dom";

interface MediaViewerProps {
    mediaUrl: string;
    mediaType: "image" | "video";
    children: any;
    onClose: any;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ mediaUrl, mediaType, onClose, children }) => {
    const portalRoot = document.getElementById("portal")!;
    const mediaElement = mediaType === "image" ? <img src={mediaUrl} alt="Preview" className="max-w-full max-h-full object-cover rounded-md shadow-01 z-[1]" /> : <video src={mediaUrl} loop className="h-full object-cover rounded-md shadow-01 z-[1]" controls></video>;
    return ReactDOM.createPortal(
        <div className="fixed top-0 left-0 h-screen w-screen overflow-y-auto z-10">
            <div className="h-fit absolute top-0 left-0 grid backdrop-blur">
                <div className="h-full w-screen fixed cursor-pointer" onClick={onClose}></div>
                <div className="h-screen w-screen flex items-center justify-center overflow-x-hidden p-5">{mediaElement}</div>
                <div className="justify-self-center mx-5 bg-01 rounded-md w-fit max-w-5xl shadow-01 mb-5 p-5 z-[1]">{children}</div>
            </div>
        </div>,
        portalRoot
    );
};
export default MediaViewer;
