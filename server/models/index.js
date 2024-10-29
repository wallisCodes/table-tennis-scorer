// Mock data to test API
let players = {
    1: {
        id: "1",
        name: "Robin Wieruch",
    },
    2: {
        id: "2",
        name: "Wolfgang Pauli",
    },
    3: {
        id: "3",
        name: "Dave Davids",
    },
    4: {
        id: "4",
        name: "Paul Oakenfold",
    }
};
  
let messages = {
    1: {
        id: "1",
        text: "Padel rules!",
        playerId: "4",
    },
    2: {
        id: "2",
        text: "Tennis is better!",
        playerId: "3",
    },
    3: {
        id: "3",
        text: "Badminton is faster!",
        playerId: "2",
    },
    4: {
        id: "4",
        text: "Pickleball is easier!",
        playerId: "1",
    }
};

export default {
    players,
    messages
};