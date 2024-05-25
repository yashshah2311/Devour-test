/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Community, User } from "../interfaces";
import "./UserCommunityRelationshipManager.css";
import { toast } from "react-hot-toast";
import CommunityLeaderboard from "./CommunityLeaderboard";

interface MutationData {
  userId: string;
  communityId: string;
}

const UserCommunityRelationshipManager = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [toggle, setToggle] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);
  
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axios.get("http://localhost:8080/user").then((res) => res.data),
  });

  const { data: communities, isLoading: communitiesLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: () =>
      axios.get("http://localhost:8080/community").then((res) => res.data),
  });

  const joinMutation = useMutation({
    mutationFn: (data: MutationData) =>
      axios.post(
        `http://localhost:8080/user/${data.userId}/join/${data.communityId}`
      ),
    onSuccess: () => {
      toast.success("Successfully joined the community");
      setLeaderboardKey((prevKey) => prevKey + 1);
    },
    onError: (error: any) => {
      if (error.response && error.response.status === 400 && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    },
  });

  const leaveMutation = useMutation({
    mutationFn: (data: MutationData) =>
      axios.delete(
        `http://localhost:8080/user/${data.userId}/leave/${data.communityId}`
      ),
    onSuccess: () => {
      toast.success("Successfully left the community");
      setLeaderboardKey((prevKey) => prevKey + 1);
    },
    onError: (error: any) => {
      if (error.response && error.response.status === 400 && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    },
  });

  const handleJoinClick = () => {
    if (selectedUser && selectedCommunity) {
      joinMutation.mutate({
        userId: selectedUser,
        communityId: selectedCommunity,
      });
    }
  };

  const handleLeaveClick = () => {
    if (selectedUser && selectedCommunity) {
      leaveMutation.mutate({
        userId: selectedUser,
        communityId: selectedCommunity,
      });
    }
  };

  const handleLeaderboardClick = () => {
    setToggle(!toggle);
  };

  if (usersLoading || communitiesLoading) return "Loading...";

  return (
    <div>
      <label>
        User: &nbsp;
        <select onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select User</option>
          {users.map((user: User) => (
            <option key={user._id} value={user._id}>
              {user.email}
            </option>
          ))}
        </select>
      </label>

      <label>
        Community: &nbsp;
        <select onChange={(e) => setSelectedCommunity(e.target.value)}>
          <option value="">Select Community</option>
          {communities.map((community: Community) => (
            <option key={community._id} value={community._id}>
              {community.name}
            </option>
          ))}
        </select>
      </label>

      <button
        className="join-button"
        onClick={handleJoinClick}
        disabled={!selectedUser || !selectedCommunity}
      >
        Join
      </button>

      <button
        className="leave-button"
        onClick={handleLeaveClick}
        disabled={!selectedUser || !selectedCommunity}
      >
        Leave
      </button>

      <button className="leaderboard-button" onClick={handleLeaderboardClick}>
        {toggle ? "Hide Leaderboard" : "Go to Leaderboard"}
      </button>

      {toggle && (
        <div>
          <CommunityLeaderboard leaderboardKey={leaderboardKey} />
        </div>
      )}
    </div>
  );
};

export default UserCommunityRelationshipManager;
