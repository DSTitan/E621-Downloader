import { BiCog, BiDetail, BiPackage, BiPhotoAlbum } from "react-icons/bi";

import * as Utility from "../utility/utils/utils.utility";

const Section: SectionProps = ({ data, dispatch }) => {
    return (
        <div className="w-80 h-full flex flex-col justify-between gap-3">
            <div className="bg-secondary p-2 rounded-md h-full shadow-01">
                <div className="button flex flex-col gap-2">
                    <button className={`hover02 color-${data.activeTab === 0 ? "primary" : "secondary"} full start no-pad py-1 drop-shadow-lg`} onClick={() => Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::active-tab", data: 0 }))}>
                        <span className="button-icon mx-2">
                            <BiPackage />
                        </span>
                        <span className="button-text">Fetch</span>
                    </button>
                    {/* <button className={`hover02 color-${data.activeTab === 1 ? "primary" : "secondary"} full start no-pad py-1 drop-shadow-lg`} onClick={() => Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::active-tab", data: 1 }))}>
                        <span className="button-icon mx-2">
                            <BiPhotoAlbum />
                        </span>
                        <span className="button-text">Gallery</span>
                    </button> */}
                </div>
            </div>
            <div className="bg-secondary p-2 rounded-md shadow-01">
                <div className="button flex flex-col gap-2">
                    <button className={`hover02 color-${data.activeTab === 2 ? "primary" : "secondary"} full start no-pad py-1 drop-shadow-lg`} onClick={() => Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::active-tab", data: 2 }))}>
                        <span className="button-icon mx-2">
                            <BiDetail />
                        </span>
                        <span className="button-text">Details</span>
                    </button>
                    <button className={`hover02 color-${data.activeTab === 3 ? "primary" : "secondary"} full start no-pad py-1 drop-shadow-lg`} onClick={() => Utility.PageTransition(dispatch, 500, () => dispatch({ type: "update::active-tab", data: 3 }))}>
                        <span className="button-icon mx-2">
                            <BiCog />
                        </span>
                        <span className="button-text">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Section;
