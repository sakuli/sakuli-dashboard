import React from "react";
import Alert from 'react-bootstrap/Alert'

interface ErrorMessageProps{
  errorMessage: string
}

const ErrorMessageBanner: React.FC<ErrorMessageProps> = (props: ErrorMessageProps) => {

  return <Alert variant={"danger"} className={"text-center"}>{props.errorMessage}</Alert>;

}
export default ErrorMessageBanner;
