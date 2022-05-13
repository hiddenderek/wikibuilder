import React, {useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks"
import { addTableText, selectTableElement } from "../features/pageCreator/pageCreator-slice";

function InfoTableText({text, index, subIndex} : {text: string, index: number, subIndex: number}) {
    const textSelected = useAppSelector((state: any) => state.pageCreator.textSelected)
    const editMode = useAppSelector((state: any) => state.userInterface.editMode)
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
        dispatch(addTableText({index, subIndex, text: targetElm.value}))
    }

    function selectText(){
        dispatch(selectTableElement({index, element: subIndex, type: "text"}))
    }
    
    return (
        <div className = {`infoTableTextContainer ${textSelected.section === index && textSelected.element === subIndex && editMode ? "infoTableContainerSelected": ""}`} onClick = {selectText}>
            <textarea ref = {textareaRef} value = {text} className = "infoTableText" onInput = {(e)=>{changeText(e)}}/>
        </div>
    )
}
export default React.memo(InfoTableText)