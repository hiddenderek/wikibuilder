import * as React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../../src/components/App'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from '../../src/app/store'

let serverRenderer = function () {
    return ({
        initialContent: renderToString(
            <StaticRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </StaticRouter>
        )

    })
}
export default serverRenderer
