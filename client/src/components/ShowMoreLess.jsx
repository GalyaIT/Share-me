import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FiChevronUp } from "react-icons/fi";


const ShowMoreLess = ({ text }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      {text?.length > 200 ? (
        <p>
          {showMore ? text : `${text.substring(0, 200)} ...`}
          <button
            className="btn text-center ml-1"
            onClick={() => setShowMore(!showMore)}
          >            
            {showMore ? <FiChevronUp /> : <FiChevronDown />}
          </button>          
        </p>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default ShowMoreLess;
