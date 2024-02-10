import "../css/leaderboard.css";
import Rankeduser from "./Rankeduser";
function Leaderboard() {
  let name = "CodeMaster";
  let soltask = 454;
  const rankedusers = [
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

  return (
    <>
    <div className="leaderboard-container">
    <div className="top-10">🏆 Top 10 Coders</div>
      <ol>
        <li>
            <Rankeduser name={name} tasks={454}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="BinaryBard" tasks={412}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="AlgorithmAce" tasks={374}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="JavaJuggernaut" tasks={352}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="PythonProdigy" tasks={317}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="CSharpChampion" tasks={297}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="RubyRocker" tasks={283}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="CodingSphinx" tasks={259}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="HTMLHero" tasks={228}></Rankeduser>
        </li>
        <li>
            <Rankeduser name="CSSWizard" tasks={201}></Rankeduser>
        </li>
      </ol>
    </div>
    </>
  );
}

export default Leaderboard;
