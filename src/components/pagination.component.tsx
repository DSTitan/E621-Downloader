import React from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

const Pagination: React.FC<{ changePage: Function; currentPage: number; dataPerPage: number; totalData: number }> = ({ changePage, currentPage, dataPerPage, totalData }) => {
    const totalPages = Math.ceil(totalData / dataPerPage);
    const centerPages = [];
    let pagesBefore = currentPage - 1;
    let pagesAfter = currentPage + 1;
    if (currentPage === totalPages) pagesBefore = pagesBefore - 2;
    else if (currentPage === totalPages - 1) pagesBefore = pagesBefore - 1;
    if (currentPage === 1) pagesAfter = pagesAfter + 2;
    else if (currentPage === 2) pagesAfter = pagesAfter + 1;
    for (let pageLength = pagesBefore; pageLength <= pagesAfter; pageLength++) {
        if (pageLength > totalPages) continue;
        if (pageLength === 0) pageLength = pageLength + 1;
        if (pageLength < 1) break;
        centerPages.push(pageLength);
    }
    return (
        <nav className="pagination no-select">
            <ul>
                {currentPage > 1 && (
                    <li className="button prev" onClick={() => changePage(currentPage - 1)}>
                        <span className="button-icon">
                            <BiLeftArrow />
                        </span>
                    </li>
                )}
                {currentPage > 2 && totalPages > 4 && (
                    <li className="numb" onClick={() => changePage(1)}>
                        <span>1</span>
                    </li>
                )}
                {currentPage > 3 && totalPages > 5 && (
                    <li className="dots">
                        <span>...</span>
                    </li>
                )}
                {centerPages.map((value) => (
                    <li key={value} className={`numb ${value === currentPage ? "active" : ""}`} onClick={() => changePage(value)}>
                        <span>{value}</span>
                    </li>
                ))}

                {currentPage < totalPages - 2 && totalPages > 5 && (
                    <li className="dots">
                        <span>...</span>
                    </li>
                )}
                {currentPage < totalPages - 1 && totalPages > 4 && (
                    <li className="numb" onClick={() => changePage(totalPages)}>
                        <span>{totalPages}</span>
                    </li>
                )}
                {currentPage < totalPages && (
                    <li className="button next" onClick={() => changePage(currentPage + 1)}>
                        <span className="button-icon">
                            <BiRightArrow />
                        </span>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
