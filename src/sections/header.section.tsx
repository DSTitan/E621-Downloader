const Section: SectionProps = ({ data }) => {
    return (
        <div className="relative bg-secondary w-full h-10 rounded-md flex justify-between items-center gap-3 shadow-01 overflow-hidden">
            <div className="title mx-2 text-center z-10 flex justify-between w-full">
                <span className="text f-01 text-white">{data.programData.name}</span>
                {data.fetchOptions.step === 5 && <span className="text f-01 text-white">{(((data.fetchOptions.posts.downloadsSuccessful + data.fetchOptions.posts.downloadsFailed) / data.fetchOptions.posts.list.length) * 100).toFixed()}%</span>}
            </div>
            {data.fetchOptions.step === 5 && <div className="absolute rounded-md duration-500 h-full bg-[#e94560]" style={{ width: `${((data.fetchOptions.posts.downloadsSuccessful + data.fetchOptions.posts.downloadsFailed) / data.fetchOptions.posts.list.length) * 100}%` }}></div>}
        </div>
    );
};

export default Section;
