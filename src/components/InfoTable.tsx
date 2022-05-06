import React from "react";
import { image, info, link, tableData } from "../features/pageCreator/pageCreator-types";
import { useAppDispatch } from "../app/hooks"
import { addTableTitle, addTableImage, addTableText, addTableInfo, addTableRelated, deleteTableElement } from "../features/pageCreator/pageCreator-slice";
import InfoTableTitle  from "./InfoTableTitle" 
import InfoTableImage from "./InfoTableImage"
import InfoTableText from "./InfoTableText"
import InfoTableInfo from "./InfoTableInfo"
import InfoTableRelated from "./InfoTableRelated"

function InfoTable({ index, tableData }: {index: number, tableData: tableData}) {
    const dispatch = useAppDispatch()
    //add title //add image //add text //add info //add related links
    const {width, titles, images, text, info, related} = tableData
    
    function addTitle() {
        dispatch(addTableTitle({index, subIndex: titles.length, text: "Type Title Here."}))
    }

    function addImage() {
        dispatch(addTableImage({index, subIndex: images.length, url: "", type: "", width: 300, height: 300}))
    }

    function addText() {
        dispatch(addTableText({index, subIndex: text.length, text: "Type Text Here."}))
    }
    
    function addInfo() {
        dispatch(addTableInfo({index, subIndex: info.length, label: "Label", text: "Type Info Here."}))
    }

    function addRelated() {
        dispatch(addTableRelated({index, subIndex: related.length, url: "Paste Link Here.", text: ""}))
    }

    function deleteElement(type: string) {
        dispatch(deleteTableElement(type))
    }

    return (
        <div className="infoTable">
            <div className="infoEditorSection">
                <p>Title</p>
                <div className = "infoEditorAddRemove">
                    <p onClick = {addTitle}>+</p>
                    <p onClick = {()=>{deleteElement("title")}}>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                {titles.map((item: string, subIndex: number)=><InfoTableTitle key = {subIndex}  title = {item} index = {index} subIndex = {subIndex}/>)}
            </div>
            <div className="infoEditorSection">
                <p>Image</p>
                <div className = "infoEditorAddRemove">
                    <p onClick = {addImage}>+</p>
                    <p onClick = {()=>{deleteElement("image")}}>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                {images.map((item: image, subIndex: number)=><InfoTableImage key = {subIndex} tableWidth = {width} url = {item.url} type = {item.type} width = {item.width} height = {item.height} index = {index} subIndex = {subIndex}/>)}
            </div>
            <div className = "infoEditorSection">
                <p>Text</p>
                <div className = "infoEditorAddRemove">
                    <p onClick = {addText}>+</p>
                    <p onClick = {()=>{deleteElement("text")}}>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                {text.map((item: string, subIndex: number)=><InfoTableText key = {subIndex}  text = {item} index = {index} subIndex = {subIndex}/>)}
            </div>
            <div className = "infoTableContent">
                
            </div>
            <div className = "infoEditorSection">
                <p>Info</p>
                <div className = "infoEditorAddRemove">
                    <p onClick = {addInfo}>+</p>
                    <p onClick = {()=>{deleteElement("info")}}>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                {info.map((item: info, subIndex: number)=><InfoTableInfo key = {subIndex} label = {item.label} text = {item.text} index = {index} subIndex = {subIndex} />)}
            </div>
            <div className = "infoEditorSection">
                <p>Related Links</p>
                <div className = "infoEditorAddRemove">
                    <p onClick = {addRelated}>+</p>
                    <p onClick = {()=>{deleteElement("related")}}>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                {related.map((item: link, subIndex: number)=><InfoTableRelated key = {subIndex} url = {item.url} text = {item.text} index = {index} subIndex = {subIndex} />)}
            </div>
        </div>
    )
}
export default React.memo(InfoTable)