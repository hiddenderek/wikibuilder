import React, {useEffect, useState} from "react";
import { useAppSelector } from "../app/hooks"
import { handleApiData } from "../utils/apicalls";
import { useHistory } from "react-router-dom"
import { contribution, page } from "../app/types"
import WikiCard from "./WikiCard";
function ProfilePage() {
    const currentUser = useAppSelector((state: any) => state.userInterface.user)
    const [wikiList, setWikiList] = useState([])
    const history = useHistory()
    useEffect(()=>{
        if (currentUser) {
            handleApiData(`/wiki/contributions/user/${currentUser}`, setWikiList, "get", null)
        }
    },[currentUser])
    return (
        <div className = "content page">
            <div className="fullWidth flexCenter">
                <button onClick = {()=>{history.push('/page')}}>Create Page</button>
            </div>
            <div className="fullWidth flexCenter">
                <h1>{`${currentUser}`}</h1>
            </div>
            <div className="fullWidth flexCenter">
                <h1>Wikis created:</h1>
            </div>
            <div className="fullWidth flexCenter">
                <h1>Recent contributions:</h1>
            </div>
            <div className="contributionDisplay">
                {wikiList?.map((item : contribution & page) => <WikiCard title = {item.title} intro_text = {item.intro_text} type = "contribution" action = {item.action_type} date = {item.time_executed}/>)}
            </div>
        </div>
    )
}
export default ProfilePage