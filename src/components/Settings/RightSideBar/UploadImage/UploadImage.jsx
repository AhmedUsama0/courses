import { useMutation } from "react-query";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateImage } from "../../../../store/store";
import {
  API_BASE_UPLOADS,
  handleError,
  useHandleData,
} from "../../../../js";
import settings from "../UploadImage/uploadimage.module.css";

const UploadImage = ({ userData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const imageFile = useRef(null);
  const dispatch = useDispatch();
  const handleData = useHandleData();

  const handleImageChange = (e) => {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage && uploadedImage !== userData.image) {
      onUploadImage(e.target.files[0]);
      imageFile.current.value = null;
    }
  };
  const mutation = useMutation({
    mutationFn: (userImage) =>
      handleData({
        method: "POST",
        endPoint: "user/changeImage.php",
        data: userImage,
        isAuthenticated: true,
      }),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setUploadResponse(data.success);
      dispatch(updateImage(data.image));
    },
    onError: (error) => {
      const { errorValue } = handleError(error);
      setUploadResponse(errorValue);
    },
    onSettled: () => {
      setIsLoading(false);
      setTimeout(() => setUploadResponse(null), 3000);
    },
  });

  const onUploadImage = (userImage) => {
    const data = new FormData();
    data.append("user_image", userImage);
    mutation.mutate(data);
  };
  return (
    <>
      {uploadResponse && (
        <div
          className={`${settings.upload__status} toast d-block position-fixed end-0`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto text-capitalize">status</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{uploadResponse}</div>
        </div>
      )}

      <form className={settings.upload__image} encType="multipart/form-data">
        <label htmlFor="image" className={settings.camera__container}>
          <i className={`fa-solid fa-camera ${settings.camera}`}></i>
        </label>

        <input
          type="file"
          accept="image/*"
          id="image"
          className="d-none"
          onChange={handleImageChange}
          ref={imageFile}
        />

        {isLoading ? (
          <div className={`rounded-3 ${settings.skeleton__loader}`}></div>
        ) : (
          <img
            src={`${API_BASE_UPLOADS}uploads/${userData.image}`}
            alt="user"
            className="d-block mx-auto mb-3 rounded-3"
            width="200px"
            height="200px"
          />
        )}
      </form>
    </>
  );
};

export default UploadImage;
