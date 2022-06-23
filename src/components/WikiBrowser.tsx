import React, {useEffect, useState} from "react"

function GameBrowserPages ({page, pageList, changePage, wikiDisplayLimit, pageDisplayLimit} : {page: number, pageList: object[], changePage: Function, wikiDisplayLimit: number, pageDisplayLimit: number}) {
    const [pageOffset, setPageOffset] = useState(0)

    function changePageOffset(direction: number) {
        if ((pageOffset + direction) >= 0) { 
            setPageOffset(prevState=>prevState + direction)
        }
    }
    useEffect(()=>{
        if ((Number(page) + 1) > (pageDisplayLimit + pageOffset)) {
            const newPageOffset = (Number(page) + 1) - Number(pageDisplayLimit)
            setPageOffset(newPageOffset)
        }
    },[page])
    function getPages() {
        const pageArray = [] as JSX.Element[]
        if (pageList.length > 0) {
            let counter = 0;
            let limitPageCounter = 1;
            let pageCounter = 1 + pageOffset;
            const initalPage = pageCounter
            pageArray.push(<div className={`pageButton ${page == (pageOffset) ? "pageHighlight" : ""}`} key={"page" + initalPage} onClick={() => { changePage(initalPage - 1) }}>{initalPage}</div>)
            for (let i = 0; i < pageList.length; i++) {
                counter++;
                if ((counter) > (wikiDisplayLimit - 1)) {
                    counter = 0;
                    limitPageCounter++
                    pageCounter++
                    if ((limitPageCounter <= pageDisplayLimit) && (i < (pageList.length - ((initalPage - 1) * wikiDisplayLimit)))) {
                        const curPage = pageCounter
                        pageArray.push(<p className={`pageButton ${page == (curPage - 1) ? "pageHighlight" : ""}`} key={"page" + curPage} onClick={() => { changePage(curPage - 1) }}>{curPage}</p>)
                    }
                }
            }
        }
        return pageArray
    }

    return(
        <ul className="pageBrowserContainer">
            {(pageList.length / wikiDisplayLimit) > pageDisplayLimit ?
            <li className = {`fullHeight ${pageOffset === 0 ? "arrowHidden" : ""}`} onClick = {()=>{changePageOffset(-1)}}>
                <img  className = "arrow" src = "/images/arrow.png" />
            </li>
            : ""}
            {getPages()}
            {(pageList.length / wikiDisplayLimit) > pageDisplayLimit ?
            <li className = {`fullHeight ${pageOffset >= ((pageList.length / wikiDisplayLimit) - pageDisplayLimit)  ? "arrowHidden" : ""}`} onClick = {()=>{changePageOffset(1)}}>
                <img  className = "arrow flip" src = "/images/arrow.png" />
            </li>
            : ""}
        </ul>
    )
}

export default React.memo(GameBrowserPages)