import React, {useEffect} from "react"
import {Switch, Route} from "react-router-dom"
import Banner from "./Banner"
import HomePage from "./HomePage"
import WikiPage from "./WikiPage"
import ProfilePage from "./ProfilePage"
import SignUpPage from "./SignUpPage"
import LogInPage from "./LogInPage"
import { useAppDispatch } from "../app/hooks"
import { setPageSize } from "../features/userInterface/userInterface-slice"

function App () {
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener('resize', () => {
                dispatch(setPageSize({width: window.innerWidth, height: window.innerHeight}))
            })
        }
    }, [])
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
                <Route path = "/signup">
                    <SignUpPage />
                </Route>
                <Route path = "/login">
                    <LogInPage />
                </Route>
            </Switch>
        </div>
    )
}

export default App