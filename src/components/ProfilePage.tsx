import React, {useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { handleApiData } from "../utils/apicalls";
import { useHistory } from "react-router-dom"
import { contribution, page } from "../app/types"
import WikiCard from "./WikiCard";
import WikiContributionTable from "./WikiContributionTable"
function ProfilePage() {
    const currentUser = useAppSelector((state: any) => state.userInterface.user)
    const [wikiCreatedList, setWikiCreatedList] = useState([])
    const [wikiContributionList, setWikiContributionList] = useState([])
    const history = useHistory()

    useEffect(()=>{
        if (currentUser) {
            handleApiData(`/wiki/contributions/user/${currentUser}`, setWikiContributionList, "get", null)
            handleApiData(`/wiki/contributions/user/${currentUser}?created=true`, setWikiCreatedList, "get", null)
        }
    }, [currentUser])

    function newPage() {
        history.push('/wiki')
    } 
    return (
        <div className="content page">
            <div className="fullWidth flexCenter">
                <button onClick={newPage}>Create Page</button>
            </div>
            <div className="fullWidth flexCenter">
                <h1>{`${currentUser}'s Profile`}</h1>
            </div>
            <div className="fullWidth flexCenter">
                <h1>Wikis created:</h1>
            </div>
            <div className="wikiCreatedDisplay">
                {wikiCreatedList?.map ? 
                    wikiCreatedList?.map((item : contribution & page) => 
                        <WikiCard title = {item.title} intro_text = {item.intro_text} type = "created" action = {item.action_type} date = {item.time_executed}/>
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