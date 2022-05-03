import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pageCreatorState, section } from './pageCreator-types';
import { createImportSpecifier, NumericLiteral } from 'typescript';


const initialState: pageCreatorState = {
   pageTitle: 'Type Title Here.',
   introText: 'Type Intro Text Here.',
   introTableData: {},
   pageSections: []
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
        setSectionText(state, action: PayloadAction<{index: number, text: string}>) {
            const {index, text} = action.payload
            state.pageSections[index].text = text 
        },
        setSectionTitle(state, action: PayloadAction<{index: number, text: string}>) {
            const {index, text} = action.payload
            state.pageSections[index].title = text
        }
    }
})

export const { pageLoad, setPageTitle, setIntroText, addSection, deleteSection, setSectionText, setSectionTitle} = pageCreatorSlice.actions
export default pageCreatorSlice.reducer;