import React, { useState, useEffect } from "react";
import InfoTable from "./InfoTable";
import PageSection from "./PageSection";
import { handleApiData } from "../utils/apicalls";
import { idGen } from '../utils/idGen'
import { pageCreatorState } from '../features/pageCreator/pageCreator-types'
import { setPageTitle, addSection } from "../features/pageCreator/pageCreator-slice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

function WikiPage() {
    const { pageTitle, introText, introTableData, pageSections } = useAppSelector((state: { pageCreator: pageCreatorState }) => state.pageCreator)
    const dispatch = useAppDispatch()
    
    function changePageTitle(e: React.FormEvent<HTMLTextAreaElement>) {
        const targetElm = e.target as HTMLInputElement
        dispatch(setPageTitle(targetElm.value))
    }

    function createSection() {
        dispatch(addSection({ title: "Type section title here.", text: "Type section text here.", tableData: {} }))
    }

    function savePage() {
        handleApiData(`/page/${pageTitle}`, null, "post", { pageTitle, introText, introTableData, pageSections })
    }

    return (
        <div className="content page">
            <div className="flexCenter">
                <button onClick={savePage}>savePage</button>
            </div>
            <textarea className = "pageTitle" value = {pageTitle} onInput = {changePageTitle} />
            <PageSection index={-1} pageTitle={pageTitle} title={''} text={introText} tableData={introTableData} />
            <div className="fullWidth">
                {pageSections.map((data, index) => <PageSection key={index} index={index} pageTitle={pageTitle} title={data.title} text={data.text} tableData={data.tableData} />)}
            </div>
            <div className="flexCenter">
                <button onClick={createSection}>Add Section</button>
            </div>
        </div>
    )
}
export default WikiPage