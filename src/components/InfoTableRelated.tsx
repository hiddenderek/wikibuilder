import React, {useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks"
import { addTableRelated, selectTableElement } from "../features/pageCreator/pageCreator-slice";

function InfoTableRelated({url, text, index, subIndex} : {url: string, text: string, index: number, subIndex: number}) {
    const relatedSelected = useAppSelector((state: any) => state.pageCreator.relatedSelected)
    const dispatch = useAppDispatch()
    const textareaRef = useRef(null)

    useEffect(()=>{
        const textareaElm = textareaRef.current as unknown as HTMLTextAreaElement
        textareaElm.style.height = "0px";
        const scrollHeight = textareaElm.scrollHeight;
        textareaElm.style.height = scrollHeight + "px";
    },[text])

    
    function changeText(e: React.FormEvent<HTMLTextAreaElement>) {
        const targetElm = e.target as HTMLTextAreaElement
        dispatch(addTableRelated({index, subIndex, url: targetElm.value, text}))
    }

    function selectRelated(){
        dispatch(selectTableElement({index, element: subIndex, type: "related"}))
    }
    //once link is set it will query database to find title of page and then set the text state to be that title. 
    //Text state overrides url state as the text value of the link.
    //If it finds the title, it will set the navigation property of the link to go to the url state value. 
    //It will also change the font color to blue to signify a working link.
    return (
        <div className = {`infoTableRelatedContainer ${relatedSelected.section === index && relatedSelected.element === subIndex ? "infoTableContainerSelected": ""}`} onClick = {selectRelated}>
            <textarea ref = {textareaRef} value = {text ? text : url} className = "infoTableRelated" onInput = {(e)=>{changeText(e)}}/>
        </div>
    )
}
export default React.memo(InfoTableRelated)