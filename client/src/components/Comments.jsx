import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import moment from 'moment';

import { client } from "../client";
import { pinCommentsQuery } from "../utils/data";


const Comments = ({ user }) => {
  const [data, setData] = useState({});
  const [postedByUserId, setPostedByUserId] = useState("");
  const [postedByImage, setPostedByImage] = useState(null);
  const [postedByUserName, setoPostedByUserName] = useState("");

  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();
  console.log(user);

  const { about, postedBy, comments } = data;
  console.log(data);

  const fetchPinComments = () => {
    const query = pinCommentsQuery(pinId);
    client.fetch(query).then((res) => {
      setData(res[0]);
      setPostedByUserId(res[0].postedBy._id);
      setPostedByImage(res[0].postedBy.image);
      setoPostedByUserName(res[0].postedBy.userName);
    });
  };

  useEffect(() => {
    fetchPinComments();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },  
            publishedAt: new Date().toISOString(),         
          },
        ])
        .commit()
        .then(() => {
          fetchPinComments();
          setComment("");
          setAddingComment(false);
        });
    }
  };
  console.log(data);
  return (
    <div>
      <h1 className="text-center font-bold">Comments</h1>

      <div className="flex gap-2 mt-5 items-center bg-indigo-50/50 rounded-lg">
        <Link
          to={`/user-profile/${postedByUserId}`}
          className="flex gap-2 m-0 items-center  rounded-lg "
        >
          <img
            src={postedByImage}
            className="w-10 h-10 rounded-full m-0"
            alt="user-profile"
          />
        </Link>

        <div className="flex flex-col justify-center">
          <p className="font-bold">{postedByUserName}</p>
          <p className="text-gray-500 text-xs">{moment(data.publishedAt).fromNow()}</p>
          <p className="text-md">{about}</p>
        </div>

      </div>


      <div className="max-h-400 overflow-y-auto">
        {comments?.map((comment, i) => (
          <div
            className="flex  gap-2 mt-5 items-center bg-white rounded-lg"
            key={i}
          >
            <div className="flex-none self-start">
              <Link to={`/user-profile/${comment.postedBy._id}`}>
                <img
                  src={comment.postedBy.image}
                  className="flex-none self-start w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>
            </div>

            <div className="flex flex-col">
              <p className="text-gray-500 font-bold">{comment.postedBy.userName}</p>
              <p className="text-gray-500 text-xs">{moment(comment.publishedAt).fromNow()}</p>
              <p>{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
     
      <div className="flex flex-wrap mt-8 mb-8 gap-3">
        <Link to={`/user-profile/${user?._id}`}>
          <img
            src={user?.image}
            className="w-10 h-10 rounded-full cursor-pointer"
            alt="user-profile"
          />
        </Link>
        <input
          className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="button"
          className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
          onClick={addComment}
        >
          {addingComment ? "Posting the comment..." : "Post"}
        </button>
      </div>    
    </div>
  );
};

export default Comments;
