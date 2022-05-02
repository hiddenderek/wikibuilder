import React from "react"
import {Switch, Route} from "react-router-dom"
import Banner from "./Banner"
import HomePage from "./HomePage"
import WikiPage from "./WikiPage"
import ProfilePage from "./ProfilePage"

function App () {

    return (
        <div className = "appContainer">
            <Banner />
            <Switch>
                <Route path="/home">
                    <HomePage />
                </Route>
                <Route path="/page">
                    <WikiPage />
                </Route>
                <Route path="/profile">
                    <ProfilePage />
                </Route>
            </Switch>
        </div>
    )
}

export default App