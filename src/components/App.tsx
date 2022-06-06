import React, {useEffect} from "react"
import {Switch, Route, useLocation} from "react-router-dom"
import Banner from "./Banner"
import HomePage from "./HomePage"
import WikiPage from "./WikiPage"
import ProfilePage from "./ProfilePage"
import SignUpPage from "./SignUpPage"
import LogInPage from "./LogInPage"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { setPageSize, setAspectRatio, setIsMobile, setDoubleBanner } from "../features/userInterface/userInterface-slice"

function App () {
    const dispatch = useAppDispatch()
    const isMobile = useAppSelector((state: any) => state.userInterface.isMobile)
    const doubleBanner = useAppSelector((state:any) => state.userInterface.doubleBanner)
    const aspectRatio = useAppSelector((state: any) =>  state.userInterface.aspectRatio)
    const location = useLocation()
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener('resize', () => {
                dispatch(setPageSize({width: window.innerWidth, height: window.innerHeight}))
            })
        }
    }, [])

    if (typeof document !== "undefined") {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        //makes sure the vh unit is updated on a window resize.
        window.addEventListener('resize', () => {
            // We execute the same script as before
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            const ua = typeof navigator !== "undefined" ? navigator?.userAgent : "desktop";
            const aspectRatioCheck = screen.width/screen.height
            const isMobileCheck = /Android|webOS|iPhone|iPad|iPod/i.test(ua)
            const doubleBannerCheck = (isMobileCheck === true && aspectRatioCheck < 1)
            if (isMobile !== isMobileCheck) {
                dispatch(setIsMobile(isMobileCheck))
            }
            if (aspectRatio !== aspectRatioCheck) {
                dispatch(setAspectRatio(aspectRatioCheck))
            }
            if (doubleBanner !== doubleBannerCheck) {
                dispatch(setDoubleBanner(doubleBannerCheck))
            }
        })
    }

    useEffect(() => {
        //checks to see if you're 
        const ua = typeof navigator !== "undefined" ? navigator?.userAgent : "desktop";
        const aspectRatio = screen.width/screen.height
        const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua)
        const doubleBannerCheck = (isMobile === true && aspectRatio < 1)
        dispatch(setAspectRatio(aspectRatio))
        dispatch(setIsMobile(isMobile))
        console.log(isMobile)
        dispatch(setDoubleBanner(doubleBannerCheck))
    },[location.pathname, typeof screen !== "undefined" ? screen.height : 1920, typeof screen !== "undefined" ? screen.width : 1080])
    console.log(doubleBanner)




    return (
        <div className = {`appContainer ${doubleBanner ? "doubleBanner" : ""}`}>
            <Banner />
            <Switch>
                <Route path="/home">
                    <HomePage />
                </Route>
                <Route path="/wiki">
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