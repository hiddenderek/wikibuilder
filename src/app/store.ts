import {configureStore} from '@reduxjs/toolkit'
import pageCreatorReducer from '../features/pageCreator/pageCreator-slice'
import userInterfaceReducer from '../features/userInterface/userInterface-slice'

export const store = configureStore({
    reducer: {
        pageCreator: pageCreatorReducer,
        userInterface: userInterfaceReducer
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>