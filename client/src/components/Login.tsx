import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import background from "../static/bg.png";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ErrorMessageBanner from "./error-message-banner";

export interface LoginProps {
    performLogin: (username: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = (props: LoginProps) => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    async function onLoginClick() {
        setShowError(!(await props.performLogin(username, password)))
        setUsername("")
        setPassword("")
    }

    return (
        <div>
            <div className={"row mt-3"}>
                <Image src={background} className={"mx-auto d-block"} fluid={true}/>
            </div>
            <div className={"row justify-content-center"}>
                <h1 className={"text-center"}>Login</h1>
            </div>
            <div className={"row justify-content-center"}>
                {showError ? <ErrorMessageBanner errorMessage={"Invalid login information"}/> : <div/>}
            </div>
            <div className={"row justify-content-center"}>
                <Form onKeyPress={(e) => e.key === 'Enter' && onLoginClick()}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter username"
                                      value={username}
                                      onChange={e => setUsername(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                                      placeholder="Password"
                                      value={password}
                                      onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Button variant="primary" type="button"
                            onClick={() => onLoginClick()}>
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default Login;