import React, { useState } from "react";
import InfoTable from "./InfoTable";

function PageSection({title, text, tableData} : any) {
    const [localTitle, setLocalTitle] = useState(title)
    const [localText, setLocalText] = useState(text)
    const [localTableData, setLocalTableData] = useState(tableData)

    function changeIntroText(e: React.FormEvent<HTMLTextAreaElement>) {
        const targetElm = e.target as HTMLInputElement
        setLocalText(targetElm.value)
    }
    return (
        <div className = "pageSection">
            {localTitle ? <h2>{localTitle}</h2> : ""}
            <div className = "introSection flexEdges">
                <textarea className = "sectionText" value = {localText} onInput = {(e)=>{changeIntroText(e)}}></textarea>
                <InfoTable tableData = {localTableData}/>
            </div>
        </div>
    )
}
export default PageSection