import React, {useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { handleApiData } from "../utils/apicalls";
import { useLocation, useHistory } from "react-router-dom"
import { contribution, page } from "../app/types"
import WikiCard from "./WikiCard";
import WikiContributionTable from "./WikiContributionTable"
import { getAfterLastCharacter } from '../utils/stringParse'
function ProfilePage() {
    const currentUser = useAppSelector((state: any) => state.userInterface.user)
    const [wikiCreatedList, setWikiCreatedList] = useState([])
    const [wikiContributionList, setWikiContributionList] = useState([])
    const history = useHistory()
    const location = useLocation()
    const user = getAfterLastCharacter({string: location.pathname, character: '/'})

    useEffect(()=>{
        if (location.pathname) {
            handleApiData(`/wiki/contributions/user/${user}`, setWikiContributionList, "get", null)
            handleApiData(`/wiki/contributions/user/${user}?created=true`, setWikiCreatedList, "get", null)
        }
    }, [location.pathname])

    function newPage() {
        history.push('/wiki')
    } 
    return (
        <div className="content page">
            {user === currentUser ?
            <div className="pageButtonContainer">
                <button onClick={newPage}>Create Page</button>
            </div>
            : ""}
            <div className="fullWidth flexCenter">
                <h1>{`${user}'s Profile`}</h1>
            </div>
            <div className="fullWidth flexCenter">
                <h1>Wikis created:</h1>
            </div>
            <div className="wikiCreatedDisplay">
                {wikiCreatedList?.map ? 
                    wikiCreatedList?.map((item : contribution & page, index: number) => 
                        <WikiCard key = {"profile_" + index} title = {item.title} intro_text = {item.intro_text} type = "created" action = {item.action_type} date = {item.time_executed}/>
                    )
                : ""}
            </div>
            <div className="fullWidth flexCenter">
                <h1>Recent contributions:</h1>
            </div>
            <WikiContributionTable wikiContributionList = {wikiContributionList as []} type = "user" />
        </div>
    )
}
export default ProfilePage