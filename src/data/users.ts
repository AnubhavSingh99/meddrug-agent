export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'Researcher' | 'Admin' | 'Viewer';
  avatar?: string;
}

export const users: User[] = [
  {
    id: "user-001",
    username: "DrJohnDoe",
    fullName: "Dr. John Doe",
    role: "Researcher",
    avatar: "/avatars/researcher.png"
  },
  {
    id: "user-002",
    username: "LabAdmin",
    fullName: "Sarah Johnson",
    role: "Admin",
    avatar: "/avatars/admin.png"
  },
  {
    id: "user-003",
    username: "ViewerUser",
    fullName: "Michael Chen",
    role: "Viewer",
    avatar: "/avatars/viewer.png"
  },
  {
    id: "user-004",
    username: "DrSmith",
    fullName: "Dr. Emily Smith",
    role: "Researcher",
    avatar: "/avatars/researcher2.png"
  }
];

export const currentUser: User = users[0]; // Default to the first user 