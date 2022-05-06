import React, {useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks"
import { addTableInfo, selectTableElement } from "../features/pageCreator/pageCreator-slice";

function InfoTableinfo({label, text, index, subIndex} : {label: string, text: string, index: number, subIndex: number}) {
    const infoSelected = useAppSelector((state: any) => state.pageCreator.infoSelected)
    const dispatch = useAppDispatch()
    const textareaRef = useRef(null)

    useEffect(()=>{
        const infoareaElm = textareaRef.current as unknown as HTMLTextAreaElement
        infoareaElm.style.height = "0px";
        const scrollHeight = infoareaElm.scrollHeight;
        infoareaElm.style.height = scrollHeight + "px";
    },[label, text])

    
    function changeInfo(e: React.FormEvent<HTMLTextAreaElement>, type: string) {
        const targetElm = e.target as HTMLTextAreaElement
        if (type === "text") {
            dispatch(addTableInfo({index, subIndex, label, text: targetElm.value}))
        } else if (type === "label") {
            dispatch(addTableInfo({index, subIndex, label: targetElm.value, text}))
        }
    }

    function selectinfo(){
        dispatch(selectTableElement({index, element: subIndex, type: "info"}))
    }

    return (
        <div className={`infoTableInfoContainer ${infoSelected.section === index && infoSelected.element === subIndex ? "infoTableContainerSelected" : ""}`} onClick={selectinfo}>
            <textarea ref={textareaRef} value={label} className="infoTableLabel" onInput={(e) => { changeInfo(e, "label") }} />
            <textarea ref={textareaRef} value={text} className="infoTableInfo" onInput={(e) => { changeInfo(e, "text") }} />
        </div>
    )
}
export default React.memo(InfoTableinfo)