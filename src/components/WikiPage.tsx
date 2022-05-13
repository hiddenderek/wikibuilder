import React, { useEffect, useRef, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import PageSection from "./PageSection";
import { handleApiData, successStatus } from "../utils/apicalls";
import { getAfterLastCharacter } from "../utils/stringParse";
import { pageCreatorState } from '../features/pageCreator/pageCreator-types'
import { setPageTitle, addSection, pageLoad, pageReset } from "../features/pageCreator/pageCreator-slice";
import { setEditMode } from "../features/userInterface/userInterface-slice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useToggle } from "../app/hooks"
import WikiContributionTable from "./WikiContributionTable";


function WikiPage() {
    const { pageTitle, introText, introTableData, pageSections } = useAppSelector((state: { pageCreator: pageCreatorState }) => state.pageCreator)
    const editMode = useAppSelector((state: any) => state.userInterface.editMode)
    const location = useLocation()
    const history  = useHistory()
    const dispatch = useAppDispatch()
    const [saveError, setSaveError] = useState('')
    const [pageLoaded, setPageLoaded] = useState(false)
    const [contributionView, toggleContributionView] = useToggle(false)
    const [wikiContributionList, setWikiContributionList] = useState([])

    useEffect(() => {
        if (location.pathname !== "/wiki") {
            console.log('LOAD PAGE' + location.pathname)
            loadPage(location.pathname)
        } else {
            dispatch(pageReset())
        }
    }, [location.pathname])

    useEffect(()=> {
        if (contributionView) {
            handleApiData(`/wiki/contributions/page/${pageTitle}`, setWikiContributionList, "get", null)
        }
    },[contributionView, pageTitle])

    async function loadPage(path: string) {
        const pageData = await handleApiData(path, null, "get", null)
        if (successStatus.includes(pageData?.status ? pageData.status : 400)) {
            try {
                console.log(pageData?.data)
                dispatch(pageLoad(pageData?.data))
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
        if (successStatus.includes(savePageResult?.status ? savePageResult.status : 400)) {
            console.log(savePageResult?.data)
            setSaveError('')
        } else {
            console.log(savePageResult?.data)
            setSaveError(savePageResult?.data)
        }
        history.push(`/wiki/pages/${pageTitle}`)
    }

    function changeEditMode(value: boolean) {
        dispatch(setEditMode(value))
        if (contributionView) {
            toggleContributionView()
        }

    }

    return (
        <div className="content page">
            <div className="pageButtonContainer">
                {!editMode ? 
                    <button onClick={() => { changeEditMode(true) }}>Contribute to Page</button> :
                    <button onClick={() => { changeEditMode(false) }}>View page</button>
                }
                <button onClick={toggleContributionView}>View contributions</button>
                {saveError ? <p>{saveError}</p> : ""}
            </div>
            {editMode ?
            <div className="fullWidth flexCenter">
                <button onClick={savePage}>savePage</button>
            </div>
            : ""}
            {!contributionView ?
                <>
                    <textarea className="pageTitle" value={pageTitle} onInput={changePageTitle} />
                    <PageSection index={-1} pageTitle={pageTitle} title={''} text={introText} tableData={introTableData} />
                    <div className="sectionContainer">
                        {pageSections.map((data, index) => <PageSection key={index} index={index} pageTitle={pageTitle} title={data.title} text={data.text} tableData={data.tableData} />)}
                    </div>
                    <div className="flexCenter">
                        <button onClick={createSection}>Add Section</button>
                    </div>
                </>
                : 
                <>
                    <WikiContributionTable wikiContributionList = {wikiContributionList as []} type = "page"/>
                </>}
        </div>
    )
}
export default WikiPage