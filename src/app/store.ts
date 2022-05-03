import {configureStore} from '@reduxjs/toolkit'
import pageCreatorReducer from '../features/pageCreator/pageCreator-slice'

export const store = configureStore({
    reducer: {
        pageCreator: pageCreatorReducer
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>