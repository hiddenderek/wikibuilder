import React from "react";
import { contribution, page } from "../app/types"
import { useHistory } from "react-router-dom"

function WikiContributionRow({title, action_type, time_executed, header, type, highlighted} : contribution & page & {header?: boolean, type?: string, highlighted?: boolean}) {
    
    const history = useHistory()
    
    function navToPage(){
        if (type === "page") {
            history.push(`/profile/${title}`)
        } else if (type === "user") {
            history.push(`/wiki/pages/${title}`)
        }
    }

    return (
        <div data-testid = "table_row" className= {`wikiContributionRow ${header ? "wikiContributionRowHeader" : ""} ${highlighted ? "wikiContributionRowHighlight" : ""}`}>
            <a data-testid = "table_row_title" onClick = {(e)=>{e.preventDefault();navToPage()}}>
                <p>{title}</p>
            </a>
            <p data-testid = "table_row_action">{action_type}</p>
            <p data-testid = "table_row_time">{time_executed}</p>
        </div>
    )
}
export default WikiContributionRow