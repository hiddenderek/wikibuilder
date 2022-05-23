/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import WikiCard from './WikiCard'
import { Provider } from 'react-redux'
import { store } from '../../src/app/store'

test('Wiki Card Display', () => {
    render(
        <Provider store={store}>
            <WikiCard key="lol" title="lol" intro_text='huh?' type="normal" />
        </Provider>
    )
    const titleElm = screen.getByText("lol")
    expect(titleElm).toBeInTheDocument()
    const introElm = screen.getByText("huh?")
    expect(introElm).toBeInTheDocument()

})