import Downloader from "./downloader";

const Process = () =>
    Downloader()
        .then((next) => {
            switch (next) {
                case "1.":
                case "1":
                    Process();
                    break;
                default:
                    process.exit();
            }
        })
        .catch(() => {});

Process();
