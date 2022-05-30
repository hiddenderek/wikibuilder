import React, {useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks"
import { addTableInfo, selectTableElement } from "../features/pageCreator/pageCreator-slice";

function InfoTableinfo({label, text, index, subIndex} : {label: string, text: string, index: number, subIndex: number}) {
    const infoSelected = useAppSelector((state: any) => state.pageCreator.infoSelected)
    const editMode = useAppSelector((state: any) => state.userInterface.editMode)
    const dispatch = useAppDispatch()
    const textareaRef = useRef(null)

    useEffect(()=>{
        const infoareaElm = textareaRef.current as unknown as HTMLTextAreaElement
        infoareaElm.style.height = "0px";
        const scrollHeight = infoareaElm.scrollHeight;
        infoareaElm.style.height = scrollHeight + "px";
    }, [label, text])


    function changeInfo(e: React.FormEvent<HTMLTextAreaElement>, type: string) {
        if (editMode) {
            const targetElm = e.target as HTMLTextAreaElement
            if (type === "text") {
                dispatch(addTableInfo({ index, subIndex, label, text: targetElm.value }))
            } else if (type === "label") {
                dispatch(addTableInfo({ index, subIndex, label: targetElm.value, text }))
            }
        }
    }

    function selectinfo() {
        dispatch(selectTableElement({index, element: subIndex, type: "info"}))
    }

    return (
        <div data-testid = {`table_info_${index}_${subIndex}`} className={`infoTableInfoContainer ${infoSelected.section === index && infoSelected.element === subIndex && editMode ? "infoTableContainerSelected" : ""}`} onClick={selectinfo}>
            <textarea data-testid = {`table_info_label_${index}_${subIndex}`} ref={textareaRef} value={label} className="infoTableLabel" onInput={(e) => { changeInfo(e, "label") }} />
            <textarea data-testid = {`table_info_text_${index}_${subIndex}`} ref={textareaRef} value={text} className="infoTableInfo" onInput={(e) => { changeInfo(e, "text") }} />
        </div>
    )
}
export default React.memo(InfoTableinfo)