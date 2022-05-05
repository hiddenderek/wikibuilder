import React, {useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks"
import { addTableTitle } from "../features/pageCreator/pageCreator-slice";

function InfoTableTitle({title, index, subIndex} : {title: string, index: number, subIndex: number}) {
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
    
    return (
        <textarea ref = {textareaRef} value = {title} className = "infoTabletitle" onInput = {(e)=>{changeTitle(e)}}/>
    )
}
export default React.memo(InfoTableTitle)