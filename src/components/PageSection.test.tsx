/**
 * @jest-environment jsdom
 */
import React from 'react'
import { cleanup, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import WikiPage from './WikiPage'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setEditMode } from '../features/userInterface/userInterface-slice'
import { addSection, pageReset } from '../features/pageCreator/pageCreator-slice'

beforeEach(async () => {
    const user = userEvent.setup()
    store.dispatch(setEditMode(true))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <WikiPage/>
            </Provider>
        </Router>
        , { route: '/wiki' })
    const pageSectionButton = screen.getByRole('button', {name: "Add Section" })
    await user.click(pageSectionButton)
})

afterEach(()=>{
    store.dispatch(pageReset())
})

test('change section title', async ()=>{
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    const sectionTitleElm = screen.getByTestId('title_section_input_0') as HTMLTextAreaElement
    expect(sectionTitleElm.value).toBe(pageState.pageSections[0].title)
    await user.clear(sectionTitleElm)
    await user.type(sectionTitleElm, "Changed Section Title")
    expect(sectionTitleElm.value).toBe("Changed Section Title")

})

test('change section text', async ()=>{
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    const sectionTextElm = screen.getByTestId('text_section_input_0') as HTMLTextAreaElement
    expect(sectionTextElm.value).toBe(pageState.pageSections[0].text)
    await user.clear(sectionTextElm)
    await user.type(sectionTextElm, "Changed Section Text")
    expect(sectionTextElm.value).toBe("Changed Section Text")

})