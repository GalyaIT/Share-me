import React, { useEffect, useState } from 'react';

import { v4 as uuidv4 } from "uuid";

import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { pinCommentsQuery } from '../utils/data';


const Comments = ({user}) => {
console.log(user);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [userId, setUserId] = useState("");
    const [image, setImage] = useState(null);
    const [userName, setUserName] = useState("");

    const [comment, setComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);

    const pin = useParams();

    const fetchPinComments = () => {
        const query = pinCommentsQuery(pin.pinId);
 
        client.fetch(query).then((res) => {     
          setData(res[0]); 
          setUserId(res[0].postedBy._id);
          setImage(res[0].postedBy.image);
          setUserName(res[0].postedBy.userName);              
        });
        
      };

      useEffect(() => {
        setLoading(true);
        fetchPinComments();
        setLoading(false);
      }, [pin.pinId]);




console.log(data)
    const addComment = () => {
        if (comment) {
          setAddingComment(true);
    
          client
            .patch(pin.pinId)         
            .insert("after", "comments[-1]", [
              {
                comment,
                _key: uuidv4(),
                postedBy: { _type: "postedBy", _ref: user._id },
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

    return (
        <div>
            <h1 className='text-center font-bold'>Comments</h1>

            <div className='flex gap-2 mt-5 items-center bg-indigo-50/50 rounded-lg'>
                <Link
                    to={`/user-profile/${userId}`}
                    className="flex gap-2 m-0 items-center  rounded-lg "
                >
                    <img
                        src={image}
                        className="w-10 h-10 rounded-full m-0"
                        alt="user-profile"
                    />
                </Link>
                <div className="flex flex-col justify-center">
                    <p className="font-bold">{userName}</p>
                    <p className='text-md'>{data.about}</p>
                </div>
            </div>


            <div className="max-h-400 overflow-y-auto">
                {data.comments?.map((comment, i) => (
                    <div
                        className="flex  gap-2 mt-5 items-center bg-white rounded-lg"
                        key={i}
                    >
                        <div className='flex-none self-start'>
                            <Link to={`/user-profile/${userId}`}>
                                <img
                                    src={image}
                                    className="flex-none self-start w-10 h-10 rounded-full cursor-pointer"
                                    alt="user-profile"
                                />
                            </Link>
                        </div>

                        <div className="flex flex-col">
                            <p className="text-gray-500 font-bold">{user.userName}</p>
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
    )
}

export default Comments
