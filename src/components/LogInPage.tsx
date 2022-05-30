import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { handleApiData, successStatus } from '../utils/apicalls'
import config from '../config'
import {setUser} from '../features/userInterface/userInterface-slice'
function LogIn(props: any) {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    function changeName(e: React.FormEvent<HTMLInputElement>) {
        const targetElm = e.target as HTMLInputElement
        setUserName(targetElm.value)
    }
    function changePassword(e: React.FormEvent<HTMLInputElement>) {
        const targetElm = e.target as HTMLInputElement
        setPassword(targetElm.value)
    }
    async function login(e: any) {
        try {
            const logInResult = await handleApiData(`/login`, null, "post", {userName, password}, config.authPort as number)
            if (successStatus.includes(logInResult?.status ? logInResult.status : 400)) {
                history.push('/profile')
                try {
                    dispatch(setUser(JSON.parse(logInResult?.data).name))
                } catch (e) {
                    console.log('USER SET ERROR: ' + e)
                }
            } else if (logInResult?.data) {
                setErrorMessage(logInResult.data)
            } else {
                setErrorMessage('Login failed.')
            }
        } catch (e) {
            console.log("LOGIN ERROR" + e)
            setErrorMessage('Something went wrong. Check console for more info.')
        }
    }
    return (
        <div className="content page">
            <div className="signUpPopup">
                <h1 className="popupHeader" >Log In</h1>
                {errorMessage ?
                    <div className={`halfWidth flexCenter mediumLineHeight errorMessage`}>
                        <p>{errorMessage}</p>
                    </div>
                    : ""}
                <div className="singleLine">
                    <label>User Name: </label>
                    <input data-testid = "user_login_input" className="mediumRelInput" placeholder="User Name..." onInput={(e) => { changeName(e) }} style={{ color: "white" }} />
                </div>
                <div className="singleLine">
                    <label>Password</label>
                    <input data-testid = "pswd_login_input" className="mediumRelInput" type="password" placeholder="Password..." onInput={(e) => { changePassword(e) }} style={{ color: "white" }} />
                </div>
                <form className="flexCenter mediumLineHeight">
                    <button type="button" className="startButton" onClick={login}>Login</button>
                </form>
            </div>
        </div>

    );
}

export default LogIn