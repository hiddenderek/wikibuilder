import React from "react";
import { image, info, link, tableData } from "../features/pageCreator/pageCreator-types";
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { setTableWidth, addTableTitle, addTableImage, addTableText, addTableInfo, addTableRelated, deleteTableElement } from "../features/pageCreator/pageCreator-slice";
import InfoTableTitle from "./InfoTableTitle"
import InfoTableImage from "./InfoTableImage"
import InfoTableText from "./InfoTableText"
import InfoTableInfo from "./InfoTableInfo"
import InfoTableRelated from "./InfoTableRelated"

function InfoTable({ index, tableData }: { index: number, tableData: tableData }) {
    const editMode = useAppSelector((state: any) => state.userInterface.editMode)
    const isMobile = useAppSelector((state: any) => state.userInterface.isMobile)
    const dispatch = useAppDispatch()
    //add title //add image //add text //add info //add related links
    const { width, titles, images, text, info, related } = tableData

    function setWidth(e: React.FormEvent<HTMLInputElement>) {
        const targetElm = e.target as HTMLInputElement
        try {
            const targetElmValue = Number(targetElm.value) /10
            if (targetElmValue) {
                if (targetElmValue <= 100) {
                    dispatch(setTableWidth({ index, width: targetElmValue}))
                }
            } else {
                dispatch(setTableWidth({ index, width: 0}))
            }
        } catch (e) {
            console.log('ERROR SETTING TABLE WIDTH: ' + e)
        }
    }

    function addTitle() {
        dispatch(addTableTitle({index, subIndex: titles.length, text: "Type Title Here."}))
    }

    function addImage() {
        dispatch(addTableImage({index, subIndex: images.length, url: "", type: "", width: -1, height: -1}))
    }

    function addText() {
        dispatch(addTableText({index, subIndex: text.length, text: "Type Text Here."}))
    }
    
    function addInfo() {
        dispatch(addTableInfo({index, subIndex: info.length, label: "Label", text: "Type Info Here."}))
    }

    function addRelated() {
        dispatch(addTableRelated({index, subIndex: related.length, url: "", text: ""}))
    }

    function deleteElement(type: string) {
        dispatch(deleteTableElement(type))
    }


    return (
        <div className={`infoTable ${(titles.length > 0 || images.length > 0 || text.length > 0 || info.length > 0 || related.length > 0) ? "" : !editMode ? "itemHidden" : ""}`} style = {{width: width >= 20 ? `${width}rem` : "20rem"}} >
            {(editMode && !isMobile) ?
                <div className="infoEditorSection">
                    <p>Table Width:</p>
                    <div className="infoEditorWidth">
                        <input value = {width !== -1 ? width * 10 : 200} onInput = {setWidth}/>
                    </div>
                </div>
                : " "}
            {editMode ?
                <div className="infoEditorSection">
                    <p>Title</p>
                    <div className="infoEditorAddRemove">
                        <img data-testid = {`table_title_add_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/plus_icon.png" onClick={addTitle} />
                        <img data-testid = {`table_title_remove_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/minus_icon.png" onClick={() => { deleteElement("title") }} />
                    </div>
                </div>
                : " "}
            <div className="infoTableContent">
                {titles.map((item: string, subIndex: number) => <InfoTableTitle key={subIndex} title={item} index={index} subIndex={subIndex} />)}
            </div>
            {editMode ?
                <div className="infoEditorSection">
                    <p>Image</p>
                    <div className="infoEditorAddRemove">
                    <img data-testid = {`table_image_add_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/plus_icon.png" onClick={addImage} />
                    <img data-testid = {`table_image_remove_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/minus_icon.png" onClick={() => { deleteElement("image") }} />
                    </div>
                </div>
                : " "}
            <div className="infoTableContent">
                {images.map((item: image, subIndex: number) => <InfoTableImage key={subIndex} tableWidth={width} url={item.url} type={item.type} width={item.width} height={item.height} index={index} subIndex={subIndex} />)}
            </div>
            {editMode ?
                <div className="infoEditorSection">
                    <p>Text</p>
                    <div className="infoEditorAddRemove">
                    <img data-testid = {`table_text_add_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/plus_icon.png" onClick={addText} />
                    <img data-testid = {`table_text_remove_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/minus_icon.png" onClick={() => { deleteElement("text") }} />
                    </div>
                </div>
                : " "}
            <div className="infoTableContent">
                {text.map((item: string, subIndex: number) => <InfoTableText key={subIndex} text={item} index={index} subIndex={subIndex} />)}
            </div>
            <div className="infoTableContent">

            </div>
            {editMode ?
                <div className="infoEditorSection">
                    <p>Info</p>
                    <div className="infoEditorAddRemove">
                    <img data-testid = {`table_info_add_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/plus_icon.png" onClick={addInfo} />
                    <img data-testid = {`table_info_remove_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/minus_icon.png" onClick={() => { deleteElement("info") }} />
                    </div>
                </div>
                : " "}
            <div className="infoTableContent">
                {info.map((item: info, subIndex: number) => <InfoTableInfo key={subIndex} label={item.label} text={item.text} index={index} subIndex={subIndex} />)}
            </div>
            {editMode ?
                <div className="infoEditorSection">
                    <p>Related Links</p>
                    <div className="infoEditorAddRemove">
                    <img data-testid = {`table_related_add_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/plus_icon.png" onClick={addRelated} />
                    <img data-testid = {`table_related_remove_${index}`} className = "infoEditorAddRemoveIcon" src = "/images/minus_icon.png" onClick={() => { deleteElement("related") }} />
                    </div>
                </div>
                : " "}
            {related.length > 0 ? <div className = "fullWidth flexCenter">Related Links:</div> : ""}
            <div className="infoTableContent">
                {related.map((item: link, subIndex: number) => <InfoTableRelated key={subIndex} url={item.url} text={item.text} index={index} subIndex={subIndex} />)}
            </div>
        </div>
    )
}
export default InfoTable