import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createImportSpecifier, NumericLiteral } from 'typescript';

interface userInterfaceState {
    pageWidth: number, 
    pageHeight: number,
}


const initialState: userInterfaceState = {
    pageWidth: 0,
    pageHeight: 0,

}

const userInterfaceSlice = createSlice({
    name: 'userInterface',
    initialState,
    reducers: {
        setPageSize(state, action: PayloadAction<{ width: number, height: number }>) {
            const { width, height } = action.payload
            state.pageWidth = width
            state.pageHeight = height
        }
    }
})

export const { setPageSize } = userInterfaceSlice.actions
export default userInterfaceSlice.reducer;