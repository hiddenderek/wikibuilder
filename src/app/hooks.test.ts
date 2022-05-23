/**
 * @jest-environment jsdom
 */


import React from 'react'
import {useToggle, useCount} from './hooks'
import {act, renderHook} from '@testing-library/react-hooks'


test('useToggle test', ()=> {
    const {result} = renderHook(()=>useToggle(false))
    //useToggle returns a reducer, so the first element [0] is the current state, and the second [1] is the dispatch function.
    const toggleState = result.current[1]
    act(()=>{
        toggleState()
        
    })   
    expect(result.current[0]).toBe(true)
})

test('useCount test', ()=> {
    const {result} = renderHook(()=>useCount(0))
    //useCount returns a reducer, so the first element [0] is the current state, and the second [1] is the dispatch function.
    const incrementState = result.current[1]
    act(()=>{
        incrementState()
        
    })   
    expect(result.current[0]).toBe(1)
})