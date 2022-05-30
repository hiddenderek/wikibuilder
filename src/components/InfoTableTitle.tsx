import React, { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { addTableTitle, selectTableElement } from "../features/pageCreator/pageCreator-slice";

function InfoTableTitle({ title, index, subIndex }: { title: string, index: number, subIndex: number }) {
    const titleSelected = useAppSelector((state: any) => state.pageCreator.titleSelected)
    const editMode = useAppSelector((state: any) => state.userInterface.editMode)
    const dispatch = useAppDispatch()
    const textareaRef = useRef(null)

    useEffect(() => {
        const textareaElm = textareaRef.current as unknown as HTMLTextAreaElement
        textareaElm.style.height = "0px";
        const scrollHeight = textareaElm.scrollHeight;
        textareaElm.style.height = scrollHeight + "px";
    }, [title])


    function changeTitle(e: React.FormEvent<HTMLTextAreaElement>) {
        if (editMode) {
            const targetElm = e.target as HTMLTextAreaElement
            dispatch(addTableTitle({ index, subIndex, text: targetElm.value }))
        }
    }

    function selectTitle() {
        dispatch(selectTableElement({ index, element: subIndex, type: "title" }))
    }

    return (
        <div data-testid={`table_title_${index}_${subIndex}`} className={`infoTableTextContainer ${titleSelected.section === index && titleSelected.element === subIndex && editMode ? "infoTableContainerSelected" : ""}`} onClick={selectTitle}>
            <textarea data-testid={`table_title_input_${index}_${subIndex}`} ref={textareaRef} value={title} className="infoTabletitle" onInput={(e) => { changeTitle(e) }} />
        </div>
    )
}
export default React.memo(InfoTableTitle)