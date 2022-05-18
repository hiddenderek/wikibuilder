import React from 'react'
import {useToggle} from './hooks'
test('useToggle test', ()=> {
    const [state, toggleState] = useToggle(false)
    toggleState()
    expect(state).toBe(true)
})