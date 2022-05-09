import React, {useEffect, useState} from "react";
import { useAppSelector } from "../app/hooks"
import { handleApiData } from "../utils/apicalls";
import { useHistory } from "react-router-dom"

function ProfilePage() {
    const currentUser = useAppSelector((state: any) => state.userInterface.user)
    const [wikiList, setWikiList] = useState([])
    const history = useHistory()
    useEffect(()=>{
        if (currentUser) {
            handleApiData(`/wikis?contributed=${currentUser}`, setWikiList, "get", null)
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
                <h1>Recently contributed:</h1>
                <div>{}</div>
            </div>
        </div>
    )
}
export default ProfilePage