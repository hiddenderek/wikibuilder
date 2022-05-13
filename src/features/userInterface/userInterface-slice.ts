import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createImportSpecifier, NumericLiteral } from 'typescript';

interface userInterfaceState {
    pageWidth: number, 
    pageHeight: number,
    user: string,
    editMode: boolean,
    searchTerm: string
}


const initialState: userInterfaceState = {
    pageWidth: 0,
    pageHeight: 0,
    user: '',
    editMode: false,
    searchTerm: ''

}

const userInterfaceSlice = createSlice({
    name: 'userInterface',
    initialState,
    reducers: {
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
        }
    }
})

export const { setPageSize, setUser, setEditMode, setSearchTerm } = userInterfaceSlice.actions
export default userInterfaceSlice.reducer;