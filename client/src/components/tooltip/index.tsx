import React, {Fragment, useRef} from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

const TooltipText = styled.div`
  ${tw`absolute hidden text-sm mb-20 bg-gray-600 text-white whitespace-nowrap
   text-center p-2 rounded-md z-10
   transition-all duration-150
  `}
`

interface ITooltip {
  text: string;
  left?: boolean;
  textColor?: string;
}
const Tooltip:React.FC<ITooltip> = ({text = '', left = false, children, textColor}) => {

  const tipRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (tipRef.current !== null){
      tipRef.current.style.display = 'block'
    }
  }

  const handleMouseLeave = () => {
    if (tipRef.current !== null){
      tipRef.current.style.display = 'none'
    }
  }

  return (
    <Fragment>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={"relative flex items-center"}>
        <TooltipText className={left ? "-left-32" : ""} ref={tipRef}>
          <div
            className="bg-gray-600 h-3 w-3 absolute"
            style={left ? {top: "29.5px", transform: "rotate(45deg)", left: "8rem"} : {top: "29.5px", transform: "rotate(45deg)" }}
          />
          {text}
        </TooltipText>
        {children}
      </div>
    </Fragment>
  );
}

export default Tooltip;
