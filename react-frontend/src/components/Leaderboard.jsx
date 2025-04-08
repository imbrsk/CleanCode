import "../css/leaderboard.css";
import Rankeduser from "./Rankeduser";
import * as React from "react";

function Leaderboard() {
  const [rankedusers, setRankedusers] = React.useState([]);

  React.useEffect(() => {
    fetchLB();
  }, []);

  const fetchLB = async () => {
    try {
      const response = await fetch("http://localhost:8000/leaderboard");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setRankedusers(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  let rankeduserList = rankedusers.map((user) => (
    <li key={user.username}>
      <Rankeduser name={user.username} tasks={user.solved}></Rankeduser>
    </li>
  ));

  return (
    <>
      <div className="leaderboard-container">
        <div className="top-10">🏆 Top 10 Coders</div>
        <ol>
          {rankeduserList}
        </ol>
      </div>
    </>
  );
}

export default Leaderboard;