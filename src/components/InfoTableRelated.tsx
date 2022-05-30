import React, {useRef, useEffect} from "react";
import { useHistory } from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks"
import { addTableRelated, selectTableElement } from "../features/pageCreator/pageCreator-slice";
import { handleApiData } from "../utils/apicalls";
import { getAfterLastCharacter } from "../utils/stringParse";
import config from '../config'

function InfoTableRelated({url, text, index, subIndex} : {url: string, text: string, index: number, subIndex: number}) {
    const relatedSelected = useAppSelector((state: any) => state.pageCreator.relatedSelected)
    const editMode = useAppSelector((state: any) => state.userInterface.editMode)
    const dispatch = useAppDispatch()
    const history = useHistory()
    const textareaRef = useRef(null)

    useEffect(()=>{
        const textareaElm = textareaRef.current as unknown as HTMLTextAreaElement
        textareaElm.style.height = "0px";
        const scrollHeight = textareaElm.scrollHeight;
        textareaElm.style.height = scrollHeight + "px";
    },[text])

    useEffect(()=>{
        if (url) {
            changeTitle()
        }
    },[url])

    async function changeTitle() {
        const urlFormat = getAfterLastCharacter({ string: url, character: config.port.toString() })
        console.log(urlFormat)
        try {
            const getWiki = await handleApiData(urlFormat, null, "get", null)
            const { title } = getWiki.data
            if (title) {
                if (title !== text) {
                    dispatch(addTableRelated({ index, subIndex, url: urlFormat, text: title }))
                }
            } else {
                dispatch(addTableRelated({ index, subIndex, url: '', text: ''}))
            }
        } catch (e) {
            dispatch(addTableRelated({ index, subIndex, url: '', text}))
        }
    }


    function changeUrl(e: React.FormEvent<HTMLTextAreaElement>) {
        const targetElm = e.target as HTMLTextAreaElement
        dispatch(addTableRelated({index, subIndex, url: targetElm.value, text}))
    }

    function selectRelated(){
        dispatch(selectTableElement({index, element: subIndex, type: "related"}))
    }

    function navRelated() {
        if (url) {
        history.push(url)
        }
    }
    //once link is set it will query database to find title of page and then set the text state to be that title. 
    //Text state overrides url state as the text value of the link.
    //If it finds the title, it will set the navigation property of the link to go to the url state value. 
    //It will also change the font color to blue to signify a working link.
    return (
        <div data-testid = {`table_related_${index}_${subIndex}`} className = {`infoTableRelatedContainer ${relatedSelected.section === index && relatedSelected.element === subIndex && editMode? "infoTableContainerSelected": ""}`} onClick = {editMode ? selectRelated : navRelated}>
            <textarea data-testid = {`table_related_input_${index}_${subIndex}`} ref = {textareaRef} value = {text ? text : url} className = {text ? "infoTableRelatedLink" : "infoTableRelated"} placeholder = "Paste link here..." onInput = {(e)=>{changeUrl(e)}}/>
        </div>
    )
}
export default React.memo(InfoTableRelated)