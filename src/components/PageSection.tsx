import React, { useEffect, useState } from "react";
import InfoTable from "./InfoTable";
import { section } from '../features/pageCreator/pageCreator-types'
import { handleApiData } from "../utils/apicalls";
import { useAppDispatch } from "../app/hooks";
import { setIntroText, deleteSection, setSectionText, setSectionTitle } from "../features/pageCreator/pageCreator-slice"

function PageSection({index, title, text, tableData, section_id, saveCounter} : section & {index: number, pageTitle: string}) {
    const dispatch = useAppDispatch()

    function removeSection() {
        dispatch(deleteSection(index))
    }

    function changeSectionTitle(e: React.FormEvent<HTMLTextAreaElement>) {
        const targetElm = e.target as HTMLInputElement
        dispatch(setSectionTitle({ index, text: targetElm.value }))
    }

    function changeSectionText(e: React.FormEvent<HTMLTextAreaElement>) {
        const targetElm = e.target as HTMLInputElement
        if (index >= 0) {
            dispatch(setSectionText({ index, text: targetElm.value }))
        } else {
            dispatch(setIntroText(targetElm.value))
        }
    }
    return (
        <div className = "pageSection">
            {index >= 0 ? <textarea className = "sectionTitle" value = {title} onInput = {(e)=>{changeSectionTitle(e)}}/> : ""}
            <div className = "flexEdges">
                <textarea className = "sectionText" value = {text} onInput = {(e)=>{changeSectionText(e)}} />
                <InfoTable tableData = {tableData}/>
            </div>
        </div>
    )
}
export default React.memo(PageSection)