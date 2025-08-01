import React from 'react';

type DiceFaceProps = {
  value: number; 
};

type PipProps = {
  className?: string;
};

const DiceFace: React.FC<DiceFaceProps> = ({ value }) => {
  if (value < 1 || value > 6) {
    return null; 
  }

  const pipClasses = `
    block w-[8px] h-[8px] rounded-full bg-gray-800
  `;

  const pipBoxShadowStyle = {
    boxShadow: `inset 0 1.5px #111, inset 0 -1.5px #555`,
  };

  const Pip: React.FC<PipProps> = ({ className }) => (
    <span className={`${pipClasses} ${className || ''}`} style={pipBoxShadowStyle}></span>
  );

  const diceFaceContainerClasses = `
    w-10 h-10 // Slightly larger size for the individual dice face
    bg-white // White background for the dice face
    rounded-md // Rounded corners for the dice face
    p-[5px] // Padding for the pips inside the dice face
    flex flex-wrap content-between justify-between // Ensure pips are laid out correctly
  `;

  const diceFaceBoxShadowStyle = {
    boxShadow: '0 4px 0 rgba(33, 55, 67, 0.4)', 
  };

  const renderDiceFace = () => {
    switch (value) {
      case 1:
        return (
          <div className="flex justify-center items-center h-full w-full">
            <Pip />
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between h-full w-full">
            <Pip />
            <Pip className="self-end" />
          </div>
        );
      case 3:
        return (
          <div className="flex justify-between h-full w-full">
            <Pip />
            <Pip className="self-center" />
            <Pip className="self-end" />
          </div>
        );
      case 4:
        return (
          <div className="flex justify-between h-full w-full">
            <div className="flex flex-col justify-between">
              <Pip />
              <Pip />
            </div>
            <div className="flex flex-col justify-between">
              <Pip />
              <Pip />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex justify-between h-full w-full">
            <div className="flex flex-col justify-between">
              <Pip />
              <Pip />
            </div>
            <div className="flex flex-col justify-center">
              <Pip />
            </div>
            <div className="flex flex-col justify-between">
              <Pip />
              <Pip />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex justify-between h-full w-full">
            <div className="flex flex-col justify-between">
              <Pip />
              <Pip />
              <Pip />
            </div>
            <div className="flex flex-col justify-between">
              <Pip />
              <Pip />
              <Pip />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={diceFaceContainerClasses} style={diceFaceBoxShadowStyle}> 
    </div>
  );
};

export default DiceFace;