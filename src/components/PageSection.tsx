import React, { useRef, useEffect } from "react";
import InfoTable from "./InfoTable";
import { section } from '../features/pageCreator/pageCreator-types'
import { handleApiData } from "../utils/apicalls";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setIntroText, deleteSection, setSectionText, setSectionTitle } from "../features/pageCreator/pageCreator-slice"

function PageSection({index, title, text, tableData, section_id, saveCounter} : section & {index: number, pageTitle: string}) {
    const dispatch = useAppDispatch()
    const pageWidth = useAppSelector((state: any)=> state.userInterface.pageWidth)
    const editMode = useAppSelector((state: any) => state.userInterface.editMode)
    const textareaRef = useRef(null)

    useEffect(()=>{
        const textareaElm = textareaRef.current as unknown as HTMLTextAreaElement
        textareaElm.style.height = "0px";
        const scrollHeight = textareaElm.scrollHeight;
        textareaElm.style.height = scrollHeight + "px";
    },[text, pageWidth])

    function removeSection() {
        dispatch(deleteSection(index))
    }

    function changeSectionTitle(e: React.FormEvent<HTMLTextAreaElement>) {
        if (editMode) {
            const targetElm = e.target as HTMLInputElement
            dispatch(setSectionTitle({ index, text: targetElm.value }))
        }
    }

    function changeSectionText(e: React.FormEvent<HTMLTextAreaElement>) {
        if (editMode) {
            const targetElm = e.target as HTMLInputElement
            dispatch(setSectionText({ index, text: targetElm.value }))
        }
    }
    return (
        <div className = "pageSection">
            {index >= 0 ? <textarea className = "sectionTitle" value = {title} onInput = {(e)=>{changeSectionTitle(e)}}/> : ""}
            <div className = "pageSectionDivider" style = {{gridTemplateColumns: `auto ${(tableData.titles.length === 0 && tableData.images.length === 0 && tableData.text.length === 0 && tableData.info.length === 0 && tableData.related.length === 0) && !editMode ? 0 : tableData.width >= 20 ? tableData.width : 20}rem`}}>
                <textarea ref = {textareaRef} className = "sectionText" value = {text} onInput = {(e)=>{changeSectionText(e)}} />
                <InfoTable index = {index} tableData = {tableData}/>
            </div>
        </div>
    )
}
export default React.memo(PageSection)