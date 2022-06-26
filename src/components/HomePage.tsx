import React, { useState, useEffect } from "react";
import {useHistory, useLocation} from "react-router-dom"
import WikiCard from "./WikiCard";
import { contribution, page } from "../app/types";
import { useAppDispatch, useAppSelector, useCount } from "../app/hooks"
import { setSearchTerm } from "../features/userInterface/userInterface-slice";
import { handleApiData } from "../utils/apicalls";
import WikiBrowser from "./WikiBrowser";

const wikiDisplayLimit = 12
const pageDisplayLimit = 4

function HomePage() {
    const history = useHistory()
    const location = useLocation()
    const dispatch = useAppDispatch()
    const [wikiFeaturedList, setWikiFeaturedList] = useState([])
    const [wikiDiscoverList, setWikiDiscoverList] = useState([])
    const [wikiSearchList, setWikiSearchList] = useState([])
    const [wikiCount, setWikiCount] = useState(0)
    const [refreshButtonCount, incrementRefreshButtonCount] = useCount(0)
    const [page, setPage] = useState(0)
    const [pageList, setPageList] = useState([] as object[])
    const isMobile = useAppSelector((state: any) =>  state.userInterface.isMobile)
    const aspectRatio = useAppSelector((state: any) => state.userInterface.aspectRatio)
    const searchTerm = useAppSelector((state: any) => state.userInterface.searchTerm)

    useEffect(()=>{
        handleApiData("/wiki/featured", setWikiFeaturedList, "get", null)
        handleApiData("/wiki/discover", setWikiDiscoverList, "get", null)
        handleApiData("/wiki/count", setWikiCount, "get", null)
        const urlParamsToJSON = '{"' + decodeURI(location.search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
        try {
            const {page, search} = JSON.parse(urlParamsToJSON.split('{""}').join('{}'))
            if (page || page === 0) {
                setPage(page)
            }
            dispatch(setSearchTerm(search))
            } catch (e) {
                console.error('Invalid URL error: '  + e)
        }
    },[])

    useEffect(() => {
        const oldURL = location.pathname + location.search
        const newURL = `/home?page=${page}${(searchTerm || searchTerm == "") ? `&search=${searchTerm}` : ""}`
        if (oldURL !== newURL) {
            history.push(newURL)
        } else {
            handleApiData('/wiki/search' + location.search, setWikiSearchList, "get", null)
            handleApiData('/wiki/search' + location.search + '&countwikis=true', setPageList, "get", null)
        }

    }, [location.search, searchTerm, page])

    //resets the page to zero when you filter by something that changes the amount of results.
    //This is to prevent you from being on a page that shouldnt exist. 
    useEffect(()=>{
        if (page !== 0 && !searchTerm) {
            changePage(0)
        }
    },[searchTerm])

    function changePage(page: number) {
        setPage(page)
    }

    function reDiscover() {
        incrementRefreshButtonCount()
        handleApiData("/wiki/discover", setWikiDiscoverList, "get", null)
    }

    return (
        <div className={!searchTerm ? "content" : !isMobile || (isMobile && (aspectRatio > 1)) ? "contentSearch" : "contentSearch contentSearchMobile"}>
            <div className="backgroundTopLeft"></div>
            <div className="backgroundBottomRight"></div>
            <div className="page">
                <div className="fullWidth flexCenter">
                </div>
                <img className="logoSection" src="/images/wikibuilderLogo.png" />
                <div className="fullWidth flexCenter">
                    <p>{`${wikiCount} Wikis created and counting`}</p>
                </div>
                {!searchTerm ?
                    <>
                        <div className="fullWidth flexCenter">
                            <h1>Todays Featured Wiki</h1>
                        </div>
                        <div data-testid = "wiki_home_featured" className="wikiCreatedDisplay">
                            {wikiFeaturedList?.map ?
                                wikiFeaturedList?.map((item: contribution & page, index: number) =>
                                    <WikiCard key = {"featured_" + index} title={item.title} intro_text={item.intro_text} type="featured" />
                                )
                                : ""}
                        </div>
                        <div className="fullWidth flexCenter">
                            <h1>Discover</h1>
                            <img data-testid = "wiki_home_discover_button" className="refreshIcon" style={{ transform: `rotate(${refreshButtonCount * 360}deg)` }} onClick={reDiscover} src="/images/refresh.png" />
                        </div>
                        <div data-testid = "wiki_home_discover"className="wikiCreatedDisplay">
                            {wikiDiscoverList?.map ?
                                wikiDiscoverList?.map((item: contribution & page, index: number) =>
                                    <WikiCard key = {"discover_" + index} title={item.title} intro_text={item.intro_text} type="normal" />
                                )
                                : ""}
                        </div>
                    </> :
                    <>
                        <div className="fullWidth flexCenter">
                            <h1>Search Results</h1>
                        </div>
                        <div data-testid = "wiki_home_search" className="wikiCreatedDisplay">
                            {wikiSearchList?.map ?
                                wikiSearchList?.map((item: contribution & page, index: number) =>
                                    <WikiCard key = {"search_" + index} title={item.title} intro_text={item.intro_text} type="normal" />
                                )
                                : ""}
                        </div>
                    </>}
            </div>
            {searchTerm && (pageList.length > wikiDisplayLimit) ? <WikiBrowser page = {page} pageList = {pageList} changePage = {changePage} wikiDisplayLimit = {wikiDisplayLimit} pageDisplayLimit = {pageDisplayLimit}/> : ""}
        </div>
    )
}
export default HomePage