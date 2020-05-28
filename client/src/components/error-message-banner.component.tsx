import React from "react";

interface ErrorMessageProps{
  errorMessage: string
}

const ErrorMessageBanner: React.FC<ErrorMessageProps> = (props: ErrorMessageProps) => {

  return <div className={"text-danger text-center"}>{props.errorMessage}</div>;

}
export default ErrorMessageBanner;
