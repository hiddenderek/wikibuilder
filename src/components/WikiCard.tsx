import React from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setEditMode } from "../features/userInterface/userInterface-slice";

function WikiCard({ title, intro_text, type, action, date }: { title: string, intro_text?: string, type: string, action?: string, date?: string }) {
    const history = useHistory()
    const dispatch = useAppDispatch()

    function navPage () {
        if (type === "created") {
            dispatch(setEditMode(true))
        } else if (type === "featured" || type === "normal") {
            dispatch(setEditMode(false))
        }
        history.push(`/wiki/pages/${title}`)
    }

    return (
        <div data-testid = "wiki_card" className={`wikiCard ${type === "featured" ? "wikiCardFeatured" : ""}`}>
            <h2 onClick = {navPage}>{title}</h2>
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