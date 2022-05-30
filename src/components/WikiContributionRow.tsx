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
        <div data-testid = "table_row" className= {`wikiContributionRow ${header ? "wikiContributionRowHeader" : ""} ${highlighted ? "wikiContributionRowHighlight" : ""}`}>
            <p data-testid = "table_row_title" onClick = {navToPage}>{title}</p>
            <p data-testid = "table_row_action">{action_type}</p>
            <p data-testid = "table_row_time">{time_executed}</p>
        </div>
    )
}
export default WikiContributionRow