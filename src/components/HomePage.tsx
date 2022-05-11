import React, {useState, useEffect} from "react";
import WikiCard from "./WikiCard";
import { contribution, page } from "../app/types";
import { handleApiData } from "../utils/apicalls";

function HomePage() {
    const [wikiDiscoverList, setWikiDiscoverList] = useState([])
    useEffect(()=>{
        handleApiData("/wiki/discover", setWikiDiscoverList, "get", null)
    }, [])

    return (
        <div className="content page">
            <div className="fullWidth flexCenter">
            </div>
            <img className = "logoSection" src = "/images/wikibuilderLogo.png"/>
            <div className="fullWidth flexCenter">
                <h1>Featured</h1>
            </div>
            <div className="fullWidth flexCenter">
                <h1>Recommended</h1>
            </div>
            <div className="fullWidth flexCenter">
                <h1>Discover</h1>
            </div>
            <div className="wikiCreatedDisplay">
                {wikiDiscoverList?.map ? 
                    wikiDiscoverList?.map((item : contribution & page) => 
                        <WikiCard title = {item.title} intro_text = {item.intro_text} type = "normal"/>
                    )
                : ""}
            </div>
            <div className="fullWidth flexCenter">
                <h1>Trending</h1>
            </div>

        </div>
    )
}
export default HomePage