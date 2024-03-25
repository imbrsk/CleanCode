import "../css/leaderboard.css";
import Rankeduser from "./Rankeduser";
import * as React from "react";
function Leaderboard() {
  let name = "CodeMaster";
  let soltask = 454;
let rankedusers = [
    {
            rank: "1",
            name: "Stefan",
            tasks: "123"
    },
    {
            rank: "2",
            name: "Boris",
            tasks: "12"           
    },
    {
            rank: "3",
            name: "Petar",
            tasks: "423"
    }
]
React.useEffect(() => {
    fetchLB();
  }, []);
const fetchLB = async () => {
    try {
      const response = await fetch("http://localhost:8000/leaderboard");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      rankedusers = await response.json();
      // Sort subjects by their number
      data.sort((a, b) => a.number - b.number);
      setSubjects(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
const rankeduserList = rankedusers.map((user) => (
    <li key={user.rank}>
        <Rankeduser name={user.name} tasks={user.tasks}></Rankeduser>
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
