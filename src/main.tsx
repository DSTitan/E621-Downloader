import React from "react";

import Section from "./sections/index.section";
import Reducer from "./modules/reducer.module";

import * as Utility from "./utility/utils/utils.utility";

const Program = () => {
    const [data, dispatch] = React.useReducer(Reducer, null as any);
    const hideLoading = React.useState(false);

    if (!data) {
        (window as any).program.readConfig().then((data: any) =>
            Utility.Wait(1500).then(() => {
                dispatch({ type: "initilize", data });
                Utility.Wait(500).then(() => hideLoading[1](true));
            })
        );
    }

    return (
        <div className="program">
            <div className="duration-500" style={{ opacity: data ? 1 : 0 }}>
                {data && (
                    <div className="w-screen h-screen p-5 mx-auto overflow-hidden">
                        <Section.Header data={data} dispatch={dispatch} />
                        <div className="flex mt-3 gap-3 split-box">
                            <Section.Sidebar data={data} dispatch={dispatch} />
                            <Section.Body data={data} dispatch={dispatch} />
                        </div>
                    </div>
                )}
            </div>
            {!hideLoading[0] && (
                <div className="duration-500 fixed top-0 left-0 z-10" style={{ opacity: data ? 0 : 1 }}>
                    <div className="flex justify-center items-center h-screen w-screen">
                        <Utility.SvgLoading w="250px" h="250px" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Program;
