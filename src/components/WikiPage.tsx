import React, { useEffect, useRef, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import PageSection from "./PageSection";
import { handleApiData, successStatus, failedStatus } from "../utils/apicalls";
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
    const currentUser = useAppSelector((state: any) => state.userInterface.user)
    const location = useLocation()
    const history  = useHistory()
    const dispatch = useAppDispatch()
    const [save, toggleSave] = useToggle(false)
    const [saveError, setSaveError] = useState('')
    const [pageLoaded, setPageLoaded] = useState(false)
    const [contributionView, toggleContributionView] = useToggle(false)
    const [wikiContributionList, setWikiContributionList] = useState([])
    const [pageAction, setPageAction] = useState('')

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

    useEffect(()=> {
        if (!save) {
            setSaveError('')
        }
    }, [save])

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
        if (editMode) {
            const targetElm = e.target as HTMLInputElement
            dispatch(setPageTitle(targetElm.value))
        }
    }

    function createSection() {
        dispatch(addSection({ 
            title: "Type section title here.", 
            text: "Type section text here.", 
            tableData: {
                width: -1, 
                titles: [], 
                images: [],
                text: [],
                info: [],
                related: []
            }
        }))
    }

    async function savePage(retry: boolean) {
        const pageSectionData = JSON.stringify(pageSections)
        const savePageResult = await handleApiData(`/wiki/pages/${pageLoaded ? getAfterLastCharacter({string: location.pathname, character: '/'}) : pageTitle}`, null, pageLoaded ? "patch" : "post", { pageTitle, introText, introTableData, pageSectionData, action: pageAction ? pageAction : "Updated page." })
        console.log(savePageResult)
        if (successStatus.includes(savePageResult?.status ? savePageResult.status : 400)) {
            console.log(savePageResult?.data)
            setSaveError('Saved page successfully.')
            setPageAction('')
        } else if (failedStatus.includes(savePageResult?.status ? savePageResult.status : 200)){
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

    function changePageAction(e: React.FormEvent<HTMLInputElement>) {
        const targetElm = e.target as HTMLInputElement
        setPageAction(targetElm.value)
    }

    return (
        <div className="content page">
            {editMode && save ? 
                <div className = "pageSaver">
                    <p>Specify Contribution to wiki</p>
                    <input type = "text" placeholder = "type contribution here" value = {pageAction} onInput = {changePageAction}/>
                    <div className = "pageButtonContainer">
                        <button onClick={()=>{savePage(true)}}>Save</button>
                        <button onClick={save ? toggleSave : undefined}>Cancel</button>
                    </div>
                    {saveError ? <p>{saveError}</p> : ""}
                </div>
            : ""}
            <div className="pageButtonContainer">
                {!editMode ? 
                    <button onClick={() => { changeEditMode(true) }}>Contribute to Page</button> :
                    <button onClick={() => { changeEditMode(false) }}>View page</button>
                }
                <button onClick={toggleContributionView}>View contributions</button>
            </div>
            {editMode ?
            <div className="fullWidth flexCenter">
                <button className = {currentUser ? "" : "inactiveButton"} onClick={!save ? toggleSave : undefined}>{currentUser ? "Save Page" : "Log in to Save Page."}</button>
            </div>
            : ""}
            {!contributionView ?
                <>
                    <textarea className="pageTitle" value={pageTitle} onInput={changePageTitle} />
                    <PageSection index={-1} pageTitle={pageTitle} title={''} text={introText} tableData={introTableData} />
                    <div className="sectionContainer">
                        {pageSections.map((data, index) => <PageSection key={index} index={index} pageTitle={pageTitle} title={data.title} text={data.text} tableData={data.tableData} />)}
                    </div>
                    {editMode ?
                    <div className="flexCenter">
                        <button onClick={createSection}>Add Section</button>
                    </div>
                    : "" }
                </>
                : 
                <>
                    <WikiContributionTable wikiContributionList = {wikiContributionList as []} type = "page"/>
                </>}
        </div>
    )
}
export default WikiPage