import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageSection from "./PageSection";
import { handleApiData } from "../utils/apicalls";
import { getAfterLastCharacter } from "../utils/stringParse";
import { pageCreatorState } from '../features/pageCreator/pageCreator-types'
import { setPageTitle, addSection, pageLoad, pageReset } from "../features/pageCreator/pageCreator-slice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { page } from "../app/types";


function WikiPage() {
    const { pageTitle, introText, introTableData, pageSections } = useAppSelector((state: { pageCreator: pageCreatorState }) => state.pageCreator)
    const location = useLocation()
    const dispatch = useAppDispatch()
    const textareaRef = useRef()
    const [saveError, setSaveError] = useState('')
    const [pageLoaded, setPageLoaded] = useState(false)

    useEffect(() => {
        if (location.pathname !== "/wiki") {
            console.log('LOAD PAGE' + location.pathname)
            loadPage(location.pathname)
        } else {
            dispatch(pageReset())
        }
    }, [location.pathname])

    async function loadPage(path: string) {
        const pageData = await handleApiData(path, null, "get", null)
        if (pageData?.status === 200) {
            try {
                console.log(pageData.data)
                dispatch(pageLoad(pageData.data))
                setPageLoaded(true)

            } catch (e) {
                console.log("ERROR PARSING PAGE DATA: " + e)
            }
        }
    }

    function changePageTitle(e: React.FormEvent<HTMLTextAreaElement>) {
        const targetElm = e.target as HTMLInputElement
        dispatch(setPageTitle(targetElm.value))
    }

    function createSection() {
        dispatch(addSection({ 
            title: "Type section title here.", 
            text: "Type section text here.", 
            tableData: {
                width: 20, 
                titles: [], 
                images: [],
                text: [],
                info: [],
                related: []
            }
        }))
    }

    async function savePage() {
        const pageSectionData = JSON.stringify(pageSections)
        const savePageResult = await handleApiData(`/wiki/pages/${pageLoaded ? getAfterLastCharacter({string: location.pathname, character: '/'}) : pageTitle}`, null, pageLoaded ? "patch" : "post", { pageTitle, introText, introTableData, pageSectionData, action: "Updated page." })
        if (savePageResult?.status === 200) {
            console.log(savePageResult?.data)
            setSaveError('')
        } else {
            console.log(savePageResult?.data)
            setSaveError(savePageResult?.data)
        }
    }

    return (
        <div className="content page">
            <div className="flexCenter">
                <button onClick={savePage}>savePage</button>
                {saveError ? <p>{saveError}</p> : ""}
            </div>
            <textarea className = "pageTitle" value = {pageTitle} onInput = {changePageTitle} />
            <PageSection index={-1} pageTitle={pageTitle} title={''} text={introText} tableData={introTableData} />
            <div className="sectionContainer">
                {pageSections.map((data, index) => <PageSection key={index} index={index} pageTitle={pageTitle} title={data.title} text={data.text} tableData={data.tableData} />)}
            </div>
            <div className="flexCenter">
                <button onClick={createSection}>Add Section</button>
            </div>
        </div>
    )
}
export default WikiPage