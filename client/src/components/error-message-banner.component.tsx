import React from "react";
import styled from "styled-components";

interface ErrorMessageProps{
  errorMessage: string
}

const ErrorDiv = styled.div`
  background-color: #ff7272;
  color: white;
  padding: 1em;
`
const ErrorMessageBanner: React.FC<ErrorMessageProps> = (props: ErrorMessageProps) => {

  return (
    <ErrorDiv>
      <div className="error-message">{props.errorMessage}</div>
    </ErrorDiv>
)
}
export default ErrorMessageBanner;
