import React from "react";
import { image, tableData } from "../features/pageCreator/pageCreator-types";
import { useAppDispatch } from "../app/hooks"
import { addTableTitle, addTableImage, deleteTableElement } from "../features/pageCreator/pageCreator-slice";
import InfoTableTitle  from "./InfoTableTitle" 
import InfoTableImage from "./InfoTableImage"
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

    function deleteImage() {
        dispatch(deleteTableElement("image"))
    }

    return (
        <div className="infoTable">
            <div className="infoEditorSection">
                <p>Title</p>
                <div className = "infoEditorAddRemove">
                    <p onClick = {addTitle}>+</p>
                    <p>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                {titles.map((item: string, subIndex: number)=><InfoTableTitle title = {item} index = {index} subIndex = {subIndex}/>)}
            </div>
            <div className="infoEditorSection">
                <p>Image</p>
                <div className = "infoEditorAddRemove">
                    <p onClick = {addImage}>+</p>
                    <p onClick = {deleteImage}>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                {images.map((item: image, subIndex: number)=><InfoTableImage tableWidth = {width} url = {item.url} type = {item.type} width = {item.width} height = {item.height} index = {index} subIndex = {subIndex}/>)}
            </div>
            <div className = "infoEditorSection">
                <p>Text</p>
                <div className = "infoEditorAddRemove">
                    <p>+</p>
                    <p>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                
            </div>
            <div className = "infoEditorSection">
                <p>Info</p>
                <div className = "infoEditorAddRemove">
                    <p>+</p>
                    <p>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                
            </div>
            <div className = "infoEditorSection">
                <p>Related Links</p>
                <div className = "infoEditorAddRemove">
                    <p>+</p>
                    <p>-</p>
                </div>
            </div>
            <div className = "infoTableContent">
                
            </div>
        </div>
    )
}
export default React.memo(InfoTable)