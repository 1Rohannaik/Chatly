export const mockUsers = [
  {
    id: "user_1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    status: "online",
    lastSeen: new Date().toISOString(),
  },
  {
    id: "user_2",
    name: "Michael Chen",
    email: "michael@example.com",
    avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
    status: "offline",
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "user_3",
    name: "Emma Williams",
    email: "emma@example.com",
    avatar: "https://ui-avatars.com/api/?name=Emma+Williams&background=random",
    status: "online",
    lastSeen: new Date().toISOString(),
  },
  {
    id: "user_4",
    name: "James Brown",
    email: "james@example.com",
    avatar: "https://ui-avatars.com/api/?name=James+Brown&background=random",
    status: "offline",
    lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "user_5",
    name: "Olivia Davis",
    email: "olivia@example.com",
    avatar: "https://ui-avatars.com/api/?name=Olivia+Davis&background=random",
    status: "online",
    lastSeen: new Date().toISOString(),
  },
];

// Mock messages data
export const mockMessages = {
  user_1: [
    {
      id: "m1",
      senderId: "user_1",
      text: "Hey there! How are you doing today?",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    },
    {
      id: "m2",
      senderId: "currentUser", // This will be replaced with the actual user ID
      text: "I'm doing great! Just working on a new project.",
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), // 1.5 hours ago
    },
    {
      id: "m3",
      senderId: "user_1",
      text: "That sounds exciting! What kind of project is it?",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: "m4",
      senderId: "currentUser",
      text: "It's a chat application called Chatly. I'm building it with React!",
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    },
  ],
  user_3: [
    {
      id: "m5",
      senderId: "user_3",
      text: "Did you see the latest tech news?",
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
    {
      id: "m6",
      senderId: "currentUser",
      text: "Not yet, what happened?",
      timestamp: new Date(Date.now() - 7000000).toISOString(), // A bit less than 2 hours ago
    },
    {
      id: "m7",
      senderId: "user_3",
      text: "There's a new JavaScript framework that everyone's talking about!",
      timestamp: new Date(Date.now() - 6800000).toISOString(), // A bit less than 2 hours ago
    },
  ],
  user_5: [
    {
      id: "m8",
      senderId: "user_5",
      text: "Hey, are we still meeting for coffee tomorrow?",
      timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    },
    {
      id: "m9",
      senderId: "currentUser",
      text: "Yes, definitely! How about 10am at the usual place?",
      timestamp: new Date(Date.now() - 39600000).toISOString(), // 11 hours ago
    },
    {
      id: "m10",
      senderId: "user_5",
      text: "Perfect! See you then.",
      timestamp: new Date(Date.now() - 36000000).toISOString(), // 10 hours ago
    },
  ],
};
