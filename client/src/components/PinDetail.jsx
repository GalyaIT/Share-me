import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdDownloadForOffline,MdOutlineChatBubbleOutline } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";


import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";



const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null); 
  const { pinId } = useParams();    


  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);
    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);       
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);
  
  if (!pinDetail) {
    return <Spinner message="Showing pin" />;
  }
 
  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            className="rounded-t-3xl rounded-b-lg"
            src={pinDetail?.image && urlFor(pinDetail?.image).url()}
            alt="user-post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <MdDownloadForOffline />
              </a>              
              <Link to={`/pin-detail/${pinId}/comments`} >
            <MdOutlineChatBubbleOutline className="w-9 h-9 p-2 flex items-center justify-center rounded-full bg-secondaryColor opacity-75 hover:opacity-100"/>
          </Link> 
            </div>
            <div>
              
            </div>
            <a  className="bg-secondaryColor flex  items-center gap-2 text-gray-900 font-bold p-2 pl-4 pr-4 rounded-full opacity-75 hover:opacity-100 "
             href={pinDetail.destination} target="_blank" rel="noreferrer">
            <BsFillArrowUpRightCircleFill />
              {pinDetail.destination?.slice(8, 20)}...
            </a>
          </div>
          <div>
            <h1 className="text-3xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail?.postedBy._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg "
          >
            <img
              src={pinDetail?.postedBy.image}
              className="w-10 h-10 rounded-full"
              alt="user-profile"
            />
            <p className="font-bold">{pinDetail?.postedBy.userName}</p>
          </Link>         
          
          {pinDetail?.comments?.length > 3 ? 
          (<Link to={`/pin-detail/${pinId}/comments`}>
            <p className="mt-5 text-md"> View all {pinDetail.comments?.length} comments </p>
          </Link>) : 
          (
            <Link to={`/pin-detail/${pinId}/comments`}>
              <p className="mt-5 text-md"> Comments</p>
            </Link>            
          )}      
      
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.slice(0,3).map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >              
               <img
                  src={comment.postedBy?.image}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
                <div className="flex flex-col">
                  <p className="text-gray-500 font-bold">{comment.postedBy?.userName}</p>
                  <Link to={`/pin-detail/${pinId}/comments`}>
                  <p>{comment.comment}</p>
                  </Link>                  
                </div>
              </div>
            ))}            
          </div>        
        </div>
      </div>
     
      {pins?.length > 0 && (       
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
        )}
        {pins?(
          <MasonryLayout pins={pins} />
        ):(
          <Spinner message="Loading more pins" />
        )}      
    </>
  );
};

export default PinDetail;
