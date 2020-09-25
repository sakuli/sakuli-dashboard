import React from "react";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { Messages } from "@sakuli-dashboard/api";

interface InfoPopoverProps {
  target: React.RefObject<HTMLElement>;
  messages: Record<string, Messages>;
  displayIndex: number;
  locale: string;
}

const InfoPopoverComponent: React.FC<InfoPopoverProps> = (props:InfoPopoverProps) => {

  const infoText = props.messages?.[props.locale]?.infoText;

  return (
    <Tippy appendTo={ props.target.current || document.body} content={infoText}>
      <span data-testid={`info-icon-${props.displayIndex}`}>
        <FontAwesomeIcon icon={faInfoCircle}/>
      </span>
    </Tippy>
  );
}
export default InfoPopoverComponent;