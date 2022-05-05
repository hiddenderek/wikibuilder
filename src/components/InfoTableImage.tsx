import React, { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { handleApiData } from "../utils/apicalls";
import { idGen } from "../utils/idGen";
import { addTableImage, selectTableElement} from "../features/pageCreator/pageCreator-slice"
import { useToggle } from "../app/hooks"

function InfoTableImage({tableWidth, url, type, width, height, index, subIndex} : {tableWidth: number, url: string, type: string, width: number, height: number, index: number, subIndex: number}) {
    const curUser = "user"
    const pageTitle = useAppSelector((state: any) => state.pageCreator.pageTitle)
    const imageSelected = useAppSelector((state: any) => state.pageCreator.imageSelected)
    const imageRef = useRef(null)
    const imageFileRef = useRef(null)
    const [imageMenu, toggleimageMenu] = useToggle(false)
    const [urlInput, setUrlInput] = useState('')
    const [newSymbolImageName, setNewSymbolImageName] = useState('')
    const [newSymbolImage, setNewSymbolImage] = useState('')
    const [newSymbolImageType, setNewSymbolImageType] = useState('')
    const [newSymbolWidth, setNewSymbolWidth] = useState(0)
    const [newSymbolHeight, setNewSymbolHeight] = useState(0)
    const dispatch = useAppDispatch()
    //change image width/height  from naturalWidth and naturalHeight when url is changed
    useEffect(()=>{
        if (newSymbolImage) {
            saveImage()
        } else {
            dispatch(addTableImage({index, subIndex, url: urlInput, type: '', width: newSymbolWidth, height: newSymbolHeight}))
        }
    },[newSymbolImage, newSymbolWidth, newSymbolHeight])

    useEffect(()=> {
        if (urlInput) {
            urlRead()
        }
    }, [urlInput])

    function urlRead() {
        const image = new Image()
        image.src = urlInput
        image.onload = () => {
            console.log('NATURAL WIDTH: ' + image.naturalWidth)
            console.log('NATURAL HEIGHT: ' + image.naturalHeight)
            setNewSymbolWidth(image.naturalWidth)
            setNewSymbolHeight(image.naturalHeight)
            if (imageRef!.current !== null) {
                const imageElm = imageRef.current as HTMLElement
                imageElm.style.display = ''
                if (imageMenu) {
                    toggleimageMenu()
                }
            }
        }
    }

    function fileRead(element: any) {
        let extensionType = "unknown"
        try {
            const extension = element?.files[0]?.name?.split('.')?.pop()?.toLowerCase()
            const extensionIndex = element?.files[0]?.name.lastIndexOf('.')
            setNewSymbolImageType(extension)
            setNewSymbolImageName(element?.files[0]?.name.slice(0, (extensionIndex)))
            extensionType = extension
        } catch (e) {
            setNewSymbolImageType("unknown")
        }
        console.log("EXTENSION TYPE: " + extensionType)
        const b64Reader = new FileReader()
        b64Reader.onload = function () {
            const data = b64Reader.result as string
            setNewSymbolImage(data)
            console.log('IMAGE DATA: ' + data)
            //get the width and height of the image
            const image = new Image()
            image.src = `${data}`
            image.onload = () => {
            console.log('NATURAL WIDTH: ' + image.naturalWidth)
            console.log('NATURAL HEIGHT: ' + image.naturalHeight)
            setNewSymbolWidth(image.naturalWidth)
            setNewSymbolHeight(image.naturalHeight)
            }
        }
        b64Reader.readAsDataURL(element.files[0])
    }

    async function saveImage() {
        const newImageName = `${curUser}-${pageTitle.split(' ').join('_')}-${newSymbolImageName}`
        const saveImage = await handleApiData(`/images/${newImageName}`, null, "post", {symbol_file: newSymbolImage, symbol_image_type: newSymbolImageType, symbol_width: newSymbolWidth, symbol_height: newSymbolHeight})
        if (saveImage?.status === 200) {
            dispatch(addTableImage({index, subIndex, url: `images/${newImageName}`, type: newSymbolImageType, width: newSymbolWidth, height: newSymbolHeight}))
            if (imageRef!.current !== null) {
                const imageElm = imageRef.current as HTMLElement
                imageElm.style.display = ''
                if (imageMenu) {
                    toggleimageMenu()
                }
            }
        }
    }

    function changeUrlInput(e: React.FormEvent<HTMLInputElement>) {
        const targetElm = e.target as HTMLInputElement
        setUrlInput(targetElm.value)
        setNewSymbolImage('')
    }

    function hideImageOnError() {
        if (imageRef!.current !== null) {
            const imageElm = imageRef.current as HTMLElement
            imageElm.style.display = 'none'
            if (!imageMenu) {
                toggleimageMenu()
            }
        }
    }

    function selectImage(){
        dispatch(selectTableElement({index, element: subIndex, type: "image"}))
    }

    return (
        <div className = {`infoTableImageContainer ${imageSelected.section === index && imageSelected.element === subIndex ? "infoTableImageContainerSelected": ""}`} style = {{height: `${tableWidth / (width/height) }rem`}} onClick = {selectImage}>
            <div className = "imageMenuToggle" onClick = {toggleimageMenu}></div>
            <img ref = {imageRef} className = "infoTableImage" style = {{aspectRatio : `${width}/${height}`}} src = {type ? `${url}.${type}` : `${url}`} onError={()=>{hideImageOnError()}}/>
            {imageMenu ? 
                <div className = "urlInput">
                    <input value = {urlInput} onInput = {(e)=>{changeUrlInput(e)}} placeholder = "Paste Url Here"/>
                    <p>Or</p>
                    <input ref = {imageFileRef} type = "file" className = "width90" onChange={(e) => { fileRead(e.target)}}></input>
                </div> 
            : ""}
        </div>
    )
}
export default InfoTableImage