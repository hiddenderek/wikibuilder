import React, { useEffect, useRef, useState } from "react";
import { contribution, page } from "../app/types"
import { useHistory } from "react-router-dom"

function WikiContributionRow({title, action_type, time_executed, header, type, highlighted} : contribution & page & {header?: boolean, type?: string, highlighted?: boolean}) {
    
    const history = useHistory()
    
    function navToPage(){
        console.log(type)
        if (type === "page") {
            history.push(`/profile/${title}`)
        } else if (type === "user") {
            history.push(`/wiki/pages/${title}`)
        }
    }

    return (
        <div className= {`wikiContributionRow ${header ? "wikiContributionRowHeader" : ""} ${highlighted ? "wikiContributionRowHighlight" : ""}`}>
            <p onClick = {navToPage}>{title}</p>
            <p>{action_type}</p>
            <p>{time_executed}</p>
        </div>
    )
}
export default WikiContributionRow