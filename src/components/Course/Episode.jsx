import { useMutation, useQueryClient } from "react-query";
import { useHandleData } from "../../js";
import { useRef } from "react";

const Episode = ({ episode, onEpisodeClick, user_id, owner_id }) => {
  const handleData = useHandleData();
  const queryClient = useQueryClient();
  const targetEpisode = useRef(null);
  const removeFocusFromAllEpisodes = () => {
    Array.from(document.querySelectorAll(".episode")).forEach(
      (episode) => (episode.style.backgroundColor = "#FFF")
    );
  };
  const highLightCurrentEpisode = (episode) => {
    episode.style.backgroundColor = "#e6e6e6";
  };
  const handleEpisodeClick = (episode, e) => {
    if (e.target !== e.currentTarget) {
      targetEpisode.current.click();
      return;
    }
    e.stopPropagation();
    removeFocusFromAllEpisodes();
    highLightCurrentEpisode(e.target);
    onEpisodeClick(episode);
  };

  const deleteEpisodeMutation = useMutation({
    mutationFn: (data) =>
      handleData({
        endPoint: "course/deleteEpisode.php",
        data: data,
        method: "POST",
        isAuthenticated: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("episodes");
    },
  });
  const onDeleteEpisode = () => {
    const data = new FormData();
    data.append("episode_id", episode.episode_id);
    deleteEpisodeMutation.mutate(data);
  };
  return (
    <li
      ref={targetEpisode}
      className="episode d-flex justify-content-between align-items-center"
      onClick={(e) => handleEpisodeClick(episode, e)}
    >
      <p className="w-100 m-0">{episode.episode_name}</p>
      {user_id === owner_id && (
        <button className="btn btn-danger" onClick={onDeleteEpisode}>
          X
        </button>
      )}
    </li>
  );
};

export default Episode;
