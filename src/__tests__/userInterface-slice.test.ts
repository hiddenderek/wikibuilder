import { store } from '../app/store'
import { setEditMode, setPageSize, setSearchTerm, setUser } from '../features/userInterface/userInterface-slice'

const dispatch = store.dispatch

test("Set page size",()=>{
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.pageWidth).toBe(0)
    expect(userInterfaceState.pageHeight).toBe(0)
    dispatch(setPageSize({width: 300, height: 300}))
    userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.pageWidth).toBe(300)
    expect(userInterfaceState.pageHeight).toBe(300)
    
})

test("Set User",()=>{
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.user).toBe('')
    dispatch(setUser('testUser'))
    userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.user).toBe('testUser')
})

test("Set Edit Mode",()=>{
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.editMode).toBe(false)
    dispatch(setEditMode(true))
    userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.editMode).toBe(true)
})

test("Set Search Term",()=>{
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.searchTerm).toBe('')
    dispatch(setSearchTerm('Test Search Term'))
    userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.searchTerm).toBe('Test Search Term')

})