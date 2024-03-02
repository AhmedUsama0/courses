import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { useLogout, useHandleData, handleError, API_BASE_UPLOADS } from "../js";
import { Episode } from "../components";
import "../css/course.css";
const Course = () => {
  const [currentEpisode, setCurrentEpisode] = useState("");
  const [userId, setUserId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [error, setError] = useState(null);

  const { course_id } = useParams();

  const logout = useLogout();
  const handleData = useHandleData();

  const {
    data: episodes,
    isLoading,
    isError,
    refetch: refetchEpisodes,
  } = useQuery({
    queryKey: ["episodes", course_id],
    queryFn: () =>
      handleData({
        method: "GET",
        endPoint: `course/readEpisodes.php?course_id=${course_id}`,
        isAuthenticated: true,
      }),
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (episodes) => {
      setCurrentEpisode(episodes.data[0]);
    },
    onError: (error) => {
      const { errorValue } = handleError(error);
      setError(errorValue);
      if (error.status === 401) setTimeout(() => logout(), 3000);
    },
    onSettled: (episodes, error) => {
      const { errorObject } = error ? handleError(error) : "";
      setUserId(episodes?.user_id ?? errorObject?.user_id);
      setOwnerId(episodes?.owner_id ?? errorObject?.owner_id);
    },
  });

  const interactionMutation = useMutation({
    mutationFn: async (data) =>
      handleData({
        method: "POST",
        endPoint: "interaction/setInteraction.php",
        data: data,
        isAuthenticated: true,
      }).then((message) => {
        return { message, episode_id: data.get("episode_id") };
      }),
    onSuccess: async ({ episode_id }) => {
      const { data: episodes } = await refetchEpisodes();
      setCurrentEpisode(
        episodes.data.find(
          (episode) => episode.episode_id === parseInt(episode_id)
        )
      );
    },
    onError: (error) => {
      const { errorValue } = handleError(error);
      setError(errorValue);
      if (error.status === 401) setTimeout(() => logout(), 1500);
    },
  });
  const onInteraction = (episode_id, interaction_type) => {
    const data = new FormData();
    data.append("episode_id", episode_id);
    data.append("interaction_type", interaction_type);
    interactionMutation.mutate(data);
  };

  if (isLoading) {
    return "loading...";
  }
  if (isError) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column vh-100">
        <p className="text-center fs-4 text-capitalize fw-bold">{error}</p>
        {ownerId === userId && userId !== null && ownerId !== null && (
          <Link
            to={`/add-episode/${course_id}`}
            className="text-decoration-none blue-button form-control text-center"
            style={{ width: "300px" }}
          >
            upload a new episode
          </Link>
        )}
      </div>
    );
  }
  return (
    <>
      {episodes && (
        <div className="course-container grid pt-3">
          {ownerId === userId && userId !== null && ownerId !== null && (
            <Link
              className="blue-button form-control text-decoration-none text-center mb-3 upload"
              to={`/add-episode/${course_id}`}
            >
              upload a new episode
            </Link>
          )}
          <aside className="episodes">
            <ul>
              {episodes.data &&
                episodes.data.map((episode, index) => {
                  return (
                    <Episode
                      user_id={userId}
                      owner_id={ownerId}
                      episode={episode}
                      key={index}
                      onEpisodeClick={(episode) => setCurrentEpisode(episode)}
                    />
                  );
                })}
            </ul>
          </aside>
          <div className="watch-course">
            <video
              width="100%"
              height="100%"
              controls
              src={`${API_BASE_UPLOADS}uploads/${currentEpisode.episode}`}
            />
            <div className="grid rounded p-2 info">
              <h3 className="video-title">{currentEpisode.episode_name}</h3>
              <div className="interaction">
                <div className="d-flex align-items-center gap-1">
                  <i
                    className="fa-sharp fa-regular fa-thumbs-up"
                    role="button"
                    title="like"
                    onClick={() => {
                      onInteraction(currentEpisode.episode_id, "like");
                    }}
                  ></i>
                  <span>{currentEpisode.number_of_likes}</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <i
                    className="fa-sharp fa-regular fa-thumbs-down"
                    role="button"
                    title="dislike"
                    onClick={() =>
                      onInteraction(currentEpisode.episode_id, "dislike")
                    }
                  ></i>
                  <span>{currentEpisode.number_of_dislikes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Course;
