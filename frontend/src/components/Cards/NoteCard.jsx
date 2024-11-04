import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";
import { useState } from 'react';

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => {
    if (!content) return '';
    
    if (isExpanded) {
      return (
        <div className="text-sm text-slate-600 mt-2">
          {content}
          <button 
            onClick={() => setIsExpanded(false)}
            className="text-primary hover:underline ml-2"
          >
            Show Less
          </button>
        </div>
      );
    }

    return (
      <div className="text-sm text-slate-600 mt-2">
        {content.substring(0, 150)}
        {content.length > 150 && (
          <>
            ...
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-primary hover:underline ml-2"
            >
              Read More
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out ${isExpanded ? 'col-span-3' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">
            {moment(date).format('Do MMM YYYY')}
          </span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>

      {renderContent()}

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">
          {tags.map((item, index) => (
            <span key={index}>#{item} </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
