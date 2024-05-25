import { useEffect, useState } from "react";
import axios from "axios";
import "./CommunityLeaderboard.css";

const CommunityLeaderboard = ({
  leaderboardKey,
}: {
  leaderboardKey: number;
}) => {
  const [leaderboard, setLeaderboard] = useState<
    { logo: string; name: string; totalPoints: number; userCount: number }[]
  >([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:8080/leaderboard");
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [leaderboardKey]);

  return (
    <div className="leaderboard">
      <h2>Community Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Rank</th>
            <th>Total Exp</th>
            <th>Number of Users</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((community, index) => (
            <tr key={community.name}>
              <td>
                <img
                  src={community.logo}
                  alt={`${community.name} logo`}
                  className="community-logo"
                />
              </td>
              <td>{community.name}</td>
              <td>{index + 1}</td>
              <td>{community.totalPoints}</td>
              <td>{community.userCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommunityLeaderboard;
