import React from "react";
import { contribution, page } from "../app/types"
import WikiContributionRow from "./WikiContributionRow";

let highlight = false

function WikiContributionTable({wikiContributionList, type} : {wikiContributionList : (contribution & page)[], type: string}) {


    return (
        <div className="wikiContributionTable">
            <WikiContributionRow title = { type === "user" ? "Wiki" : "User" } action_type = "Contribution" time_executed = "Date" header = {true}/>
            <WikiContributionRow title = " " action_type = " " time_executed = " "/>
            {wikiContributionList?.map ?
                wikiContributionList.map((item: contribution & page, index: number) => {highlight = !highlight; return <WikiContributionRow key = {index} title = {type === "user" ? item.title : item.username as string} action_type = {item.action_type} time_executed = {item.time_executed} type = {type} highlighted = {highlight}/>})
            :""}
        </div>
    )
}
export default WikiContributionTable