import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createImportSpecifier, NumericLiteral } from 'typescript';

interface userInterfaceState {
    pageWidth: number, 
    pageHeight: number,
    user: string,
    editMode: boolean
}


const initialState: userInterfaceState = {
    pageWidth: 0,
    pageHeight: 0,
    user: '',
    editMode: false

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
        }
    }
})

export const { setPageSize, setUser, setEditMode } = userInterfaceSlice.actions
export default userInterfaceSlice.reducer;