
import React, { useState } from "react";
import { client, urlFor } from "../client";
import { Link, useNavigate} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline, MdOutlineChatBubbleOutline, MdOutlineLibraryAdd } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import {FcLike} from 'react-icons/fc';
import {VscHeart} from 'react-icons/vsc';

import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import {FiEdit} from 'react-icons/fi';
import Dialog from "./Dialog";
import { fetchUser } from "../utils/fetchUser";
const style ={color:"red", fontSize:"1.5em"};

const Pin = ({ pin }) => {
const [postHovered, setPostHovered] = useState(false);
const [isSaved, setIsSaved]=useState(false);

const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,   
  });

  const navigate = useNavigate();
  const user = fetchUser();
  const { postedBy, image, _id, destination, save, comments } = pin;

  // const alreadySaved = !!save?.filter((item) => item.postedBy?._id === user?.sub)
  //   ?.length;
  let alreadySaved = save?.filter((item) => item?.postedBy?._id === user?.sub);  

  const savePin = (_id) => {

    if (alreadySaved?.length > 0 ) {
      if (isSaved === false) {
        client
          .patch(_id)
          .unset([`save[userId=="${user?.sub}"]`])
          .commit()
          .then(() => {        
            setIsSaved(true);
          });
      } else {
        client
          .patch(_id)
          .insert("after", "save[-1]", [
            {
              _key: uuidv4(),
              userId: user?.sub,
              postedBy: {
                _type: "postedBy",
                _ref: user?.sub,
              },
            },
          ])
          .commit()
          .then(() => {       
            setIsSaved(false);
          });
      }
    }
    if (alreadySaved?.length === 0 && isSaved === false) {

      client
        .patch(_id)
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {       
          setIsSaved(true);
        });
    } else {
      setIsSaved(true)
      client
        .patch(_id)
        .unset([`save[userId=="${user?.sub}"]`])
        .commit()
        .then(() => {       
          setIsSaved(!isSaved);
        });
    }
  };   
      
  const handleDelete = (id) => {   
     handleDialog("Are you sure you want to delete?", true);    
  };

  const handleDialog = (message, isLoading) => {
    setDialog({
      message,
      isLoading     
    });
  }

  const areUSureDelete = (choose) => {
    if (choose) {     
     client.delete(pin._id).then(() => {
     window.location.reload();
    });
      handleDialog("", false);
      
    } else {
      handleDialog("", false);      
    }
  };

  return (
    <div className="m-2">      
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}       
        onClick={() => navigate(`/pin-detail/${_id}`)}       
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full min-h-150px"
          src={urlFor(image).width(250).url()}
          alt="user-post"
        />
        {postHovered && (
          <div>
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {postedBy?._id !== user?.sub && (
                
                <>           
                    {alreadySaved.length > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSaved(true);
                          savePin(_id);
                        }}
                        type="button"                        
                        className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"                  
                      >
                        {isSaved === false ? <FcLike style={style} /> : <VscHeart style={style} />}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSaved(!isSaved);
                          savePin(_id);
                        }}
                        type="button"                        
                         className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"                    
                      >
                        {isSaved === true ? <FcLike style={style} /> : <VscHeart style={style} />}
                      </button>
                    )}             
                </>

              )}
            </div>

            <div className=" flex justify-between items-center gap-2 w-full mb-6">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-3 pr-3 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.slice(8, 15)}...
                </a>
              )}
              {postedBy?._id === user?.sub && (
               <div className="flex justify-between"> 
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(_id);                   
                  }}
                  className="bg-white mr-1 p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete />
                </button>
                <button
                  type="button"
                  onClick={(e) =>
                    {
                      e.stopPropagation();
                      navigate(`/pin-detail/${_id}/editPin`)
                    }}           
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                   <FiEdit/>
                </button>
                
               </div>                
              )}
            </div>
          
              {dialog.isLoading && (
                <Dialog
                  onDialog={areUSureDelete}
                  message={dialog.message}
                />
              )}       
 
          </div>
         
            <div className="absolute bottom-0 flex items-center justify-start w-full bg-white p-1 pl-2 text-black font-medium opacity-75">
              <VscHeart />

              {alreadySaved?.length===0 ?(
                isSaved===true? <p className="pr-5 pl-2 text-sm">{save?.length + 1} save</p>:<p className="pr-5 pl-2 text-sm">{save?.length} save</p>

              ):(
                isSaved===true? <p className="pr-5 pl-2 text-sm">{save?.length-1} save</p>:<p className="pr-5 pl-2 text-sm">{save?.length} save</p>
              )}           
         
              <MdOutlineChatBubbleOutline />
              <p className="pl-2 text-sm"> {comments?.length} {comments?.length === 1 ? 'comment' : 'comments'}</p>
            </div>
          </div>         
        )}
      </div>    
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-3 items-center"
      >
        <img
          className="w-6 h-6 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize text-sm">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;


















// import React, { useState } from "react";
// import { client, urlFor } from "../client";
// import { Link, useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
// import { MdDownloadForOffline, MdOutlineChatBubbleOutline, MdOutlineLibraryAdd } from "react-icons/md";
// import { AiTwotoneDelete } from "react-icons/ai";
// import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
// import {FiEdit} from 'react-icons/fi';
// import Dialog from "./Dialog";
// import { fetchUser } from "../utils/fetchUser";


// const Pin = ({ pin }) => {
//   const [postHovered, setPostHovered] = useState(false);
//   const [savingPost, setSavingPost] = useState(false);
//   const [unSavingPost, setUnSavingPost] = useState(false);

//   const [dialog, setDialog] = useState({
//     message: "",
//     isLoading: false,   
//   });

//   const navigate = useNavigate();
//   const user = fetchUser();
//   const { postedBy, image, _id, destination, save, comments } = pin;
//   console.log(pin);

//   const alreadySaved = !!save?.filter((item) => item.postedBy?._id === user?.sub)
//     ?.length;

//   const savePin = (id) => {
//     if (!alreadySaved) {
//       setSavingPost(true);

//       client
//         .patch(id)
//         // .setIfMissing({ save: [] })
//         .insert("after", "save[-1]", [
//           {
//             _key: uuidv4(),
//             userId: user?.sub,
//             postedBy: {
//               _type: "postedBy",
//               _ref: user?.sub,
//             },
//           },
//         ])
//         .commit()
//         .then(() => {
//           window.location.reload();
//           setSavingPost(false);
//         });
//     } else {
//       setUnSavingPost(true);
//       client
//         .patch(id)
//         .unset([`save[userId=="${user?.sub}"]`])
//         .commit()
//         .then(() => {
//           window.location.reload();
//           setUnSavingPost(false);
//         });
//     }
//   };

//   const handleDelete = (id) => {   
//      handleDialog("Are you sure you want to delete?", true);    
//   };

//   const handleDialog = (message, isLoading) => {
//     setDialog({
//       message,
//       isLoading     
//     });
//   }

//   const areUSureDelete = (choose) => {
//     if (choose) {     
//      client.delete(pin._id).then(() => {
//      window.location.reload();
//     });
//       handleDialog("", false);
      
//     } else {
//       handleDialog("", false);      
//     }
//   };

//   return (
//     <div className="m-2">      
//       <div
//         onMouseEnter={() => setPostHovered(true)}
//         onMouseLeave={() => setPostHovered(false)}
//         onClick={() => navigate(`/pin-detail/${_id}`)}
//         className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
//       >
//         <img
//           className="rounded-lg w-full min-h-150px"
//           src={urlFor(image).width(250).url()}
//           alt="user-post"
//         />
//         {postHovered && (
//           <div>
//           <div
//             className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
//             style={{ height: "100%" }}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex gap-2">
//                 <a
//                   href={`${image?.asset?.url}?dl=`}
//                   download
//                   onClick={(e) => {
//                     e.stopPropagation();
//                   }}
//                   className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
//                 >
//                   <MdDownloadForOffline />
//                 </a>
//               </div>

//               {postedBy?._id !== user?.sub && (
//                 <>
//                   {alreadySaved ? (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         savePin(_id);
//                       }}
//                       type="button"
//                       className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
//                     >
//                       {unSavingPost ? "Unsaving" : "Saved"}
//                     </button>
//                   ) : (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         savePin(_id);
//                       }}
//                       type="button"
//                       className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
//                     >
//                       {savingPost ? "Saving" : "Save"}
//                     </button>
//                   )}
//                 </>

//               )}
//             </div>

//             <div className=" flex justify-between items-center gap-2 w-full mb-6">
//               {destination && (
//                 <a
//                   href={destination}
//                   target="_blank"
//                   className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-3 pr-3 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
//                   rel="noreferrer"
//                 >
//                   <BsFillArrowUpRightCircleFill />
//                   {destination.slice(8, 15)}...
//                 </a>
//               )}
//               {postedBy?._id === user?.sub && (
//                <div className="flex justify-between"> 
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(_id);                   
//                   }}
//                   className="bg-white mr-1 p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
//                 >
//                   <AiTwotoneDelete />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={(e) =>
//                     {
//                       e.stopPropagation();
//                       navigate(`/pin-detail/${_id}/editPin`)
//                     }}           
//                   className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
//                 >
//                    <FiEdit/>
//                 </button>
                
//                </div>                
//               )}
//             </div>
          
//               {dialog.isLoading && (
//                 <Dialog
//                   onDialog={areUSureDelete}
//                   message={dialog.message}
//                 />
//               )}       
 
//           </div>
//             <div className="absolute bottom-0 flex items-center justify-start w-full bg-white p-1 pl-2 text-black font-medium opacity-75">
//               <MdOutlineLibraryAdd />
//               <p className="pr-5 pl-2 text-sm">{save?.length} save</p>
//               <MdOutlineChatBubbleOutline />
//               <p className="pl-2 text-sm"> {comments?.length} {comments?.length === 1 ? 'comment' : 'comments'}</p>
//             </div>
//           </div>

         
//         )}
//       </div>    
//       <Link
//         to={`/user-profile/${postedBy?._id}`}
//         className="flex gap-2 mt-3 items-center"
//       >
//         <img
//           className="w-6 h-6 rounded-full object-cover"
//           src={postedBy?.image}
//           alt="user-profile"
//         />
//         <p className="font-semibold capitalize text-sm">{postedBy?.userName}</p>
//       </Link>
//     </div>
//   );
// };

// export default Pin;



















