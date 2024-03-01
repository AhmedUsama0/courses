import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useLogout, validator, useHandleData,handleError } from "../js";
const Episode = () => {
  const [response, setResponse] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();
  const handleData = useHandleData();

  const [episode, setEpisode] = useState({
    uploadedEpisode: null,
    episodeName: "",
    episodeDuration: 0,
    course_id: useParams().course_id,
  });

  const [episodeValidation, setEpisodeValidation] = useState({
    isEpisodeNameValid: true,
    isUploadedEpisodeValid: true,
  });

  const handleEpisodeChange = (e) => {
    const uploadedEpisode = e.target.files[0];
    if (uploadedEpisode) {
      getEpisodeDuration(uploadedEpisode)
        .then((episodeDuration) => {
          setEpisode({
            ...episode,
            episodeDuration: episodeDuration,
            uploadedEpisode: uploadedEpisode,
          });
        })
        .catch(() => {
          setEpisode({
            ...episode,
            episodeDuration: 0,
            uploadedEpisode: uploadedEpisode,
          });
        });
    }
  };

  const getEpisodeDuration = (uploadedEpisode) => {
    return new Promise((resolve, reject) => {
      const episodeURL = URL.createObjectURL(uploadedEpisode);
      const episode = document.createElement("video");
      episode.src = episodeURL;

      episode.addEventListener("loadedmetadata", () => {
        const episodeDuration = Math.round(episode.duration);
        URL.revokeObjectURL(episodeURL);
        resolve(episodeDuration);
      });

      episode.addEventListener("error", (error) => {
        URL.revokeObjectURL(episodeURL);
        reject(error);
      });
    });
  };

  const isValidUploadedEpisode = () => {
    const allowedEpisodeTypes = ["video/mp4", "video/mkv"];
    return allowedEpisodeTypes.includes(episode.uploadedEpisode?.type);
  };

  const isEpisodeValid = () => {
    const isEpisodeNameValid = validator(
      episode.episodeName,
      /^[a-zA-Z0-9\s]+$/
    );
    const isUploadedEpisodeValid = isValidUploadedEpisode();

    setEpisodeValidation({
      isEpisodeNameValid: isEpisodeNameValid,
      isUploadedEpisodeValid: isUploadedEpisodeValid,
    });

    return isEpisodeNameValid && isUploadedEpisodeValid;
  };

  const episodeMutation = useMutation({
    mutationFn: (episode) =>
      handleData({
        method: "POST",
        endPoint: "course/createEpisode.php",
        data: episode,
        isAuthenticated: true,
      }),
    onMutate: () => setIsUploading(true),
    onSuccess: (message) => {
      setIsSuccess(true);
      setResponse(message.success);
      setTimeout(() => navigate(`/course/${episode.course_id}`));
    },

    onError: (error) => {
      const { errorValue } = handleError(error);
      setResponse(errorValue);
      if (error.status === 401) {
        setTimeout(() => logout(), 1500);
      }
    },

    onSettled: () => {
      setIsUploading(false);
      setTimeout(() => setResponse(""), 2000);
    },
  });

  const onUpload = (e) => {
    e.preventDefault();
    if (!isEpisodeValid()) return;
    const data = new FormData();
    data.append("uploadedEpisode", episode.uploadedEpisode);
    data.append("episodeName", episode.episodeName);
    data.append("course_id", episode.course_id);
    data.append("episodeDuration", episode.episodeDuration);
    episodeMutation.mutate(data);
  };
  return (
    <>
      <div
        className="grid vh-100 px-3"
        style={{
          placeContent: "center",
        }}
      >
        <form
          onSubmit={onUpload}
          encType="multipart/form-data"
          className="grid position-relative add-episode"
          method="POST"
        >
          {response && (
            <div
              className={`response p-3 ${
                isSuccess ? "text-success" : "text-danger"
              }`}
            >
              {response}
            </div>
          )}
          <div style={{ gridColumn: "span 12" }}>
            <label htmlFor="episodeName" className="mb-2">
              Episode Name
            </label>
            <input
              disabled={isUploading}
              value={episode.episodeName}
              type="string"
              id="episodeName"
              className="form-control"
              onChange={(e) =>
                setEpisode({ ...episode, episodeName: e.target.value })
              }
            />
            {!episodeValidation.isEpisodeNameValid && (
              <div className="text-danger">
                allowed characters are letters,numbers and whitespaces.
              </div>
            )}
          </div>
          <div style={{ gridColumn: "span 12" }}>
            <label htmlFor="episode" className="mb-2">
              Episode
            </label>
            <input
              disabled={isUploading}
              type="file"
              accept="video/mp4,video/mkv"
              className="form-control"
              onChange={handleEpisodeChange}
              id="episode"
            />
            {!episodeValidation.isUploadedEpisodeValid && (
              <div className="text-danger">
                episode should be of type mp4 or mkv.
              </div>
            )}
          </div>
          {!isUploading && (
            <input
              type="submit"
              value="upload a new episode"
              className="form-control p-2 blue-button"
              style={{ gridColumn: "span 12" }}
            />
          )}
          {isUploading && (
            <button
              style={{ gridColumn: "span 12" }}
              className="form-control p-2 blue-button"
              type="submit"
              disabled
            >
              <span
                className="spinner-border spinner-border-sm mx-1"
                role="status"
                aria-hidden="true"
              ></span>
              uploading...
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Episode;
