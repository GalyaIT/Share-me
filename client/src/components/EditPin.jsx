import React, { useState, useEffect, useRef} from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";

import { categories } from "../utils/data";
import { client } from "../client";
import Spinner from "./Spinner";
import { pinQuery } from "../utils/data";

const EditPin = ({ user}) => {
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const errorMessages = {};
  const { pinId } = useParams();

  const titleInput = useRef();
  const aboutInput = useRef();
  const destinationInput = useRef();
  const categoryInput = useRef();



  const fetchPin = () => {
    let query = pinQuery(pinId);   
    if (query) {
      client.fetch(query).then((data) => {
        setPin(data[0]);
        setImageAsset(data[0].image.asset);       
     });
    }
  };

  useEffect(() => {  
    fetchPin();
  }, [pinId]); 




  const uploadImage = (e) => {
    const selectedFile = e.target.files[0]; 

    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      setWrongImageType(false);
      setLoading(true);
     
      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const formValidation = (updatedPin, imageAsset) => {
    let isValid = true;

    if (updatedPin?.title?.trim().length < 3) {
      console.log(updatedPin?.title);
      errorMessages.title = "Title must be at length 3 or more!";     
      isValid = false;
    }
    if (updatedPin?.title?.trim().length > 50) {
      errorMessages.title = "Title must be at length less 50!";
      isValid = false;
    }
    if (updatedPin?.about?.trim().length < 10) {
      errorMessages.about = "Description must be at length 10 or more!";
      isValid = false;
    }
    if (updatedPin?.about?.trim().length > 500) {
      errorMessages.about = "Description must be at length less 500!";
      isValid = false;
    }
    if (updatedPin?.destination?.length === 0) {
      errorMessages.destination = "The field imageUrl can't be empty!";
      isValid = false;
    }
    else if (!updatedPin?.destination?.startsWith("http")) {
      errorMessages.destination = "Invalid Url!";
      isValid = false;
    }    
    if (!imageAsset?._id) {
      console.log(imageAsset?._id);
    errorMessages.imageAsset = "Select file to upload!";
    isValid = false;
  }
    setErrors(errorMessages);
    return isValid;
  };


  const updatePin = () => {

    const updatedPin ={
      _id:pinId,
      title: titleInput?.current?.value,
      about: aboutInput?.current?.value, 
      destination: destinationInput?.current?.value,
      category: categoryInput?.current?.value,    
    }
 
    const isValid = formValidation(updatedPin, imageAsset);  

    if (isValid) {      
      const  doc = {
          _type: "pin",
          title: updatedPin.title,
          about: updatedPin.about,
          destination: updatedPin.destination,
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset?._id,
            },
          },
          category: updatedPin.category,
        };   
  
      client.patch(pinId)
        .set(doc)
        .commit()
        .then(() => {
          console.log('updated');
          navigate("/");
        });
    } else {
      setFields(true);

      setTimeout(() => {
        setFields(false);
      }, 3000);
    }
  };

  return (   
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-md bg-red-50 w-full text-center py-3 transition-all duration-150 ease-in ">
          Please add all fields.
        </p>
      )}
      <h1>EDIT PIN</h1>
    
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {fields && (
              <p className="text-red-400 text-sm">{errors.imageAsset}</p>
            )}

            {loading && <Spinner />}
            {wrongImageType && <p>It&apos;s wrong file type.</p>}
        
            {!imageAsset ? (
              <label>                
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>       
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"            
            defaultValue={pin?.title}
            ref={titleInput}              
            placeholder="Add your title"
            className="placeholder:text-xl outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {fields && <p className="text-red-400 text-sm">{errors.title}</p>}

          {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            defaultValue={pin?.about}
            ref={aboutInput}  
            placeholder="Tell everyone what your Pin is about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {fields && <p className="text-red-400 text-sm">{errors.about}</p>}
          <input
            type="url"
            defaultValue={pin?.destination}
            ref={destinationInput}  
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {fields && (
            <p className="text-red-400 text-sm">{errors.destination}</p>
          )}

          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">
                Choose Pin Category
              </p>              
              <select
                ref={categoryInput}  
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option defaultValue="" className="sm:text-bg bg-white">
                {pin?.category}
                </option>
                {categories.map((item, id) => (
                  <option
                    key={id}
                    className="text-base border-0 outline-none capitalize bg-white text-black "
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={updatePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Update Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPin;
