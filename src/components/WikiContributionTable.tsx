import React, { useEffect, useRef, useState } from "react";
import { contribution, page } from "../app/types"
import WikiContributionRow from "./WikiContributionRow";

let highlight = false

function WikiContributionTable({wikiContributionList} : {wikiContributionList : []}) {


    return (
        <div className="wikiContributionTable">
            <WikiContributionRow title = "Wiki" action_type = "Contribution" time_executed = "Date" header = {true}/>
            <WikiContributionRow title = " " action_type = " " time_executed = " "/>
            {wikiContributionList.map((item: contribution & page) => {highlight = !highlight; return <WikiContributionRow title = {item.title} action_type = {item.action_type} time_executed = {item.time_executed} highlighted = {highlight}/>})}
        </div>
    )
}
export default WikiContributionTable