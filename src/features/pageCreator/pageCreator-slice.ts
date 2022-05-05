import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pageCreatorState, section } from './pageCreator-types';
import { createImportSpecifier, NumericLiteral } from 'typescript';


const initialState: pageCreatorState = {
    pageTitle: 'Type Title Here.',
    introText: 'Type Intro Text Here.',
    introTableData: {
        width: 20,
        titles: [],
        images: [],
        text: [],
        info: [],
        related: []
    },
    pageSections: [],
    titleSelected: {element: -1, section: -1},
    imageSelected: {element: -1, section: -1},
    textSelected: {element: -1, section: -1},
    infoSelected: {element: -1, section: -1},
    relatedSelected: {element: -1, section: -1}
}

const pageCreatorSlice = createSlice({
    name: 'pageCreator',
    initialState,
    reducers: {
        pageLoad(state, action: PayloadAction<pageCreatorState>) {
            return action.payload
        },
        setPageTitle(state, action: PayloadAction<string>) {
            state.pageTitle = action.payload
        },
        setIntroText(state, action: PayloadAction<string>) {
            state.introText = action.payload
        },
        addSection(state, action: PayloadAction<section>) {
            state.pageSections.push(action.payload)
        },
        deleteSection(state, action: PayloadAction<number>) {
            delete state.pageSections[action.payload]
        },
        setSectionText(state, action: PayloadAction<{ index: number, text: string }>) {
            const { index, text } = action.payload
            if (index >= 0) {
                state.pageSections[index].text = text
            } else {
                state.introText = text
            }
        },
        setSectionTitle(state, action: PayloadAction<{ index: number, text: string }>) {
            const { index, text } = action.payload
            state.pageSections[index].title = text
        },
        addTableTitle(state, action: PayloadAction<{ index: number, subIndex: number, text: string }>) {
            const { index, subIndex, text } = action.payload
            if (index >= 0) {
                state.pageSections[index].tableData.titles[subIndex] = text
            } else {
                state.introTableData.titles[subIndex] = text
            }
        },
        addTableImage(state, action: PayloadAction<{ index: number, subIndex: number, url: string, type: string, width: number, height: number }>) {
            const { index, subIndex, url, type, width, height } = action.payload
            if (index >= 0) {
                state.pageSections[index].tableData.images[subIndex] = { url, type, width, height }
            } else {
                state.introTableData.images[subIndex] = { url, type, width, height }
            }
        },
        selectTableElement(state, action: PayloadAction<{index: number, element: number, type: string }>) {
            const {index, element, type } = action.payload
            console.log(type)
            console.log(index)
            console.log(element)
            switch (type) {
                case ("title"):
                     state.titleSelected = {element, section: index}
                    break
                case ("image"):
                    state.imageSelected = {element, section: index}
                    break
                case ("text"):
                    state.textSelected = {element, section: index}
                    break
                case ("info"):
                    state.infoSelected = {element, section: index}
                    break
                case ("related"):
                    state.relatedSelected = {element, section: index}
                    break
            }
        },
        deleteTableElement(state, action: PayloadAction<string>) {
            switch (action.payload) {
                case ("title"):{ 
                    const {element, section} = state.titleSelected
                    if (section >= 0) {
                        state.pageSections[section].tableData.titles.splice(element, 1)
                    } else {
                        state.introTableData.titles.splice(element, 1)
                    }
                    break
                } case ("image"):{
                    const {element, section} = state.imageSelected
                    if (section >= 0) {
                        state.pageSections[section].tableData.images.splice(element, 1)
                    } else {
                        state.introTableData.images.splice(element, 1)
                    }
                    break
                } case ("text"):{
                    const {element, section} = state.textSelected
                    if (section >= 0) {
                        state.pageSections[section].tableData.text.splice(element, 1)
                    } else {
                        state.introTableData.text.splice(element, 1)
                    }
                    break
                } case ("info"):{
                    const {element, section} = state.infoSelected
                    if (section >= 0) {
                        state.pageSections[section].tableData.info.splice(element, 1)
                    } else {
                        state.introTableData.info.splice(element, 1)
                    }
                    break
                } case ("related"):{
                    const {element, section} = state.relatedSelected
                    if (section >= 0) {
                        state.pageSections[section].tableData.related.splice(element, 1)
                    } else {
                        state.introTableData.related.splice(element, 1)
                    }
                    break
                }
            }      
        }
    }
})

export const { pageLoad, setPageTitle, setIntroText, addSection, deleteSection, setSectionText, setSectionTitle, addTableTitle, addTableImage, selectTableElement, deleteTableElement } = pageCreatorSlice.actions
export default pageCreatorSlice.reducer;