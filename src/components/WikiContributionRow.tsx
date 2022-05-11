import React, { useEffect, useRef, useState } from "react";
import { contribution, page } from "../app/types"

function WikiContributionRow({title, action_type, time_executed, header, highlighted} : contribution & page & {header?: boolean, highlighted?: boolean}) {


    return (
        <div className= {`wikiContributionRow ${header ? "wikiContributionRowHeader" : ""} ${highlighted ? "wikiContributionRowHighlight" : ""}`}>
            <p>{title}</p>
            <p>{action_type}</p>
            <p>{time_executed}</p>
        </div>
    )
}
export default WikiContributionRow