import React, {useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks"
import { addTableTitle, selectTableElement } from "../features/pageCreator/pageCreator-slice";

function InfoTableTitle({title, index, subIndex} : {title: string, index: number, subIndex: number}) {
    const titleSelected = useAppSelector((state: any) => state.pageCreator.titleSelected)
    const dispatch = useAppDispatch()
    const textareaRef = useRef(null)

    useEffect(()=>{
        const textareaElm = textareaRef.current as unknown as HTMLTextAreaElement
        textareaElm.style.height = "0px";
        const scrollHeight = textareaElm.scrollHeight;
        textareaElm.style.height = scrollHeight + "px";
    },[title])

    
    function changeTitle(e: React.FormEvent<HTMLTextAreaElement>) {
        const targetElm = e.target as HTMLTextAreaElement
        dispatch(addTableTitle({index, subIndex, text: targetElm.value}))
    }

    function selectImage(){
        dispatch(selectTableElement({index, element: subIndex, type: "title"}))
    }
    
    return (
        <div className = {`infoTableTextContainer ${titleSelected.section === index && titleSelected.element === subIndex ? "infoTableContainerSelected": ""}`} onClick = {selectImage}>
        <textarea ref = {textareaRef} value = {title} className = "infoTabletitle" onInput = {(e)=>{changeTitle(e)}}/>
        </div>
    )
}
export default React.memo(InfoTableTitle)