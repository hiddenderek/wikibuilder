import React from "react";
import { useHistory } from "react-router-dom";

function WikiCard({ title, intro_text, type, action, date }: { title: string, intro_text?: string, type: string, action?: string, date?: string }) {
    const history = useHistory()
    return (
        <div className="wikiCard">
            <h2 onClick = {()=>{history.push(`/wiki/pages/${title}`)}}>{title}</h2>
            <div className={`wikiCardIntroText ${type === "contribution" || type === "created"  ? "wikiCardIntroTextContribution" : "wikiCardIntroTextNormal"}`}>
                <p>{intro_text}</p>
            </div>
            <div className="wikiCardBottomSection">
                <div className = "wikiCardFadeEffect"/>                
                {type === "contribution" || type === "created" ?
                    <div className="wikiContributionInfo">
                        <div className="fullWidth flexEdges">
                            <p>Action:</p><p>{action}</p>
                        </div>
                        <div className="fullWidth flexEdges">
                            <p>Date Modified:</p><p>{date}</p>
                        </div>
                    </div>
                    : ""}
            </div>
        </div>
    )
}
export default WikiCard