import React, { useState, useEffect } from "react";
import WikiCard from "./WikiCard";
import { contribution, page } from "../app/types";
import { useAppSelector, useCount } from "../app/hooks"
import { handleApiData } from "../utils/apicalls";

function HomePage() {
    const [wikiFeaturedList, setWikiFeaturedList] = useState([])
    const [wikiDiscoverList, setWikiDiscoverList] = useState([])
    const [wikiSearchList, setWikiSearchList] = useState([])
    const [wikiCount, setWikiCount] = useState(0)
    const [refreshButtonCount, incrementRefreshButtonCount] = useCount(0)
    const searchTerm = useAppSelector((state: any) => state.userInterface.searchTerm)
    useEffect(() => {
        handleApiData("/wiki/featured", setWikiFeaturedList, "get", null)
        handleApiData("/wiki/discover", setWikiDiscoverList, "get", null)
        handleApiData("/wiki/count", setWikiCount, "get", null)
    }, [])

    useEffect(() => {
        handleApiData(`/wiki/search?search=${searchTerm}`, setWikiSearchList, "get", null)
    }, [searchTerm])

    function reDiscover() {
        incrementRefreshButtonCount()
        handleApiData("/wiki/discover", setWikiDiscoverList, "get", null)
    }

    console.log(wikiCount)

    return (
        <div className="content">
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
                            <img className="refreshIcon" style={{ transform: `rotate(${refreshButtonCount * 360}deg)` }} onClick={reDiscover} src="/images/refresh.png" />
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
        </div>
    )
}
export default HomePage