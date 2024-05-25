export interface User {
    _id: string;
    email: string;
    passwordHash: string;
    profilePicture: string;
    experiencePoints: { points: number, timestamp: Date }[];
  }
  
  // Define interface for Community
  export interface Community {
    _id: string;
    name: string;
    logo: string;
    members: User[];
  }