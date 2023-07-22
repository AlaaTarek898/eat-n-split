import { Fragment, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selection, setSelection] = useState(null);
  function handleForm() {
    setShowAddFriend(!showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    setSelection((selection) => (selection?.id === friend.id ? null : friend));
  }
  function handleSplit(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selection.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelection(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelection={handleSelection}
          selection={selection}
        />

        {showAddFriend && <Form handleAddFriend={handleAddFriend} />}

        <Button onClick={handleForm}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selection && (
        <FormBILL selection={selection} handleSplit={handleSplit} />
      )}
    </div>
  );
}

export default App;

function FriendList({ friends, handleSelection, selection }) {
  return (
    <Fragment>
      <ul>
        {friends.map((friend) => (
          <Frienditem
            key={friend.id}
            friend={friend}
            handleSelection={handleSelection}
            selection={selection}
          />
        ))}
      </ul>
    </Fragment>
  );
}

function Frienditem({ friend, handleSelection, selection }) {
  return (
    <Fragment>
      <li className={selection?.id === friend.id ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name}
            {Math.abs(friend.balance)}{" "}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you
            {Math.abs(friend.balance)}{" "}
          </p>
        )}
        {friend.balance === 0 && (
          <p>
            You owe {friend.name}
            {Math.abs(friend.balance)}{" "}
          </p>
        )}
        <Button onClick={() => handleSelection(friend)}>
          {selection?.id === friend.id ? "close" : "select"}
        </Button>
      </li>
    </Fragment>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Form({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    handleAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <Fragment>
      <form className="form-add-friend " onSubmit={handleSubmit}>
        <label>👩🏼‍🤝‍👩🏻Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>👩🏼image url</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button className="button"> Add</button>
      </form>
    </Fragment>
  );
}

function FormBILL({ selection, handleSplit }) {
  const [bill, setBill] = useState("");
  const [paidByuser, setPaidbyuser] = useState("");
  const paidByFreind = bill ? bill - paidByuser : "";
  const [whoIsPaid, setwhoIsPaid] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByuser) return;
    handleSplit(whoIsPaid === "user" ? paidByFreind : -paidByFreind);
  }
  return (
    <Fragment>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>SPLIT A BILL WITH {selection.name}</h2>
        <label>💰 Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />
        <label>🧍‍♀️ Your expense</label>
        <input
          type="text"
          value={paidByuser}
          onChange={(e) =>
            setPaidbyuser(
              Number(e.target.value) > bill
                ? paidByuser
                : Number(e.target.value)
            )
          }
        />
        <label>👫 {selection.name} expense</label>
        <input type="text" disabled value={paidByFreind} />
        <label>🤑 Who is paying the bill</label>
        <select
          value={whoIsPaid}
          onChange={(e) => setwhoIsPaid(e.target.value)}
        >
          <option value="user">you</option>
          <option value={selection.name}>{selection.name}</option>
        </select>
        <button className="button">split bill</button>
      </form>
    </Fragment>
  );
}
