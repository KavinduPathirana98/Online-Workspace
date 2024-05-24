import React, { Fragment, useEffect, useState } from "react";
import { H6, P } from "../../../AbstractElements";
import { ContactHistory } from "../../../Constant";
import socket from "../../Socket";

const ChatPanel = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [randomNumber, setRandomNumber] = useState(null);
  const [randomString, setRandomString] = useState("");

  // Function to generate a random number between min and max (inclusive)
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to generate a random string of a given length
  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  };
  // Handler for generating random values
  const handleGenerate = () => {
    const number = generateRandomNumber(1, 100); // Generates a number between 1 and 100
    const string = generateRandomString(10); // Generates a string of length 10
    setRandomNumber(number);
    setRandomString(string);
    setUsername(number);
    setRoom(string);
  };
  const socketRef = React.useRef(null);
  const joinRoom = () => {
    if (username && room) {
      console.log(username, room);
      socket.emit("joinRoom", { username, room });
      setJoined(true);
      socketRef.current = socket;
    }
  };

  const sendMessage = () => {
    if (message) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };
  const closehistory = () => {
    document.querySelector(".history").classList.remove("show");
  };
  const handleJoin = () => {
    if (username && room) {
      // Store username and room in local storage
      localStorage.setItem("username", username);
      localStorage.setItem("room", room);
      joinRoom(username, room);
    }
  };

  useEffect(() => {
    handleGenerate();

    // Retrieve stored user and room info from local storage
    const storedUsername = localStorage.getItem("username");
    const storedRoom = localStorage.getItem("room");

    if (username && room) {
      setUsername(username);
      setRoom(room);
      joinRoom(username, room);
    }

    socket.on("message", (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);
  return (
    <Fragment>
      <div id="right-history" className="history">
        <div className="modal-header p-l-20 p-r-20">
          <H6 attrH6={{ className: "modal-title w-100" }}>
            {ContactHistory}
            <span className="pull-right">
              <a
                className="closehistory"
                href="#javaScript"
                onClick={closehistory}
              >
                <i className="icofont icofont-close"></i>
              </a>
            </span>
          </H6>
        </div>
        <div className="history-details">
          <div className="text-center">
            <i className="icofont icofont-ui-edit"></i>
            <P>{"Contact has not been modified yet."}</P>
          </div>
          <div className="media">
            <i className="icofont icofont-star me-3"></i>
            <div className="media-body mt-0">
              <H6 attrH6={{ className: "mt-0" }}>{"Contact Created"}</H6>
              <P attrPara={{ className: "mb-0" }}>
                {"Contact is created via mail"}
              </P>
              <span className="f-12">{"Sep 10, 2022 4:00"}</span>
            </div>
          </div>
        </div>
        {!joined ? (
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button onClick={handleJoin}>Join Room</button>
          </div>
        ) : (
          <div>
            <div>
              {messages.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.user}</strong>: {msg.text}
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send Message</button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ChatPanel;
