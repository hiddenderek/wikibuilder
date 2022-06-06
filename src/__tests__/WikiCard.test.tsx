/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import WikiCard from '../components/WikiCard'
import { Provider } from 'react-redux'
import { store } from '../app/store'

test('Wiki Card Display', () => {
    render(
        <Provider store={store}>
            <WikiCard key="wikiCard" title="wiki card title" intro_text='wiki card intro text' type="normal" />
        </Provider>
    )
    const titleElm = screen.getByText("wiki card title")
    expect(titleElm).toBeInTheDocument()
    const introElm = screen.getByText("wiki card intro text")
    expect(introElm).toBeInTheDocument()

})