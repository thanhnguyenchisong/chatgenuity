import React from 'react';

const FormattedMessage = ({ content }) => {
  const renderFormattedContent = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="whitespace-pre-wrap break-words">
      {content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {renderFormattedContent(line)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FormattedMessage;