import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createImportSpecifier, NumericLiteral } from 'typescript';

interface userInterfaceState {
    pageWidth: number, 
    pageHeight: number,
    user: string,
    editMode: boolean,
    searchTerm: string,
    aspectRatio: number,
    isMobile: boolean,
    doubleBanner: boolean
}


const initialState: userInterfaceState = {
    pageWidth: 0,
    pageHeight: 0,
    user: '',
    editMode: false,
    searchTerm: '',
    aspectRatio: 1.78,
    isMobile: false,
    doubleBanner: false
}

const userInterfaceSlice = createSlice({
    name: 'userInterface',
    initialState,
    reducers: {
        resetUserInterface(){
            return initialState
        },
        setPageSize(state, action: PayloadAction<{ width: number, height: number }>) {
            const { width, height } = action.payload
            state.pageWidth = width
            state.pageHeight = height
        },
        setUser(state, action: PayloadAction<string>) {
            state.user = action.payload
        },
        setEditMode(state, action: PayloadAction<boolean>) {
            state.editMode = action.payload
        },
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload
        },
        setAspectRatio(state, action: PayloadAction<number>) {
            state.aspectRatio = action.payload
        },
        setIsMobile(state, action: PayloadAction<boolean>) {
            state.isMobile = action.payload
        },
        setDoubleBanner(state, action: PayloadAction<boolean>) {
            state.doubleBanner = action.payload
        }
    }
})

export const { resetUserInterface, setPageSize, setUser, setEditMode, setSearchTerm, setAspectRatio, setIsMobile, setDoubleBanner } = userInterfaceSlice.actions
export default userInterfaceSlice.reducer;