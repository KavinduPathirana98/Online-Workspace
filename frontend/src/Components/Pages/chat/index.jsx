import React, { Fragment, useEffect, useState } from "react";
import { H6, P } from "../../../AbstractElements";
import { ContactHistory } from "../../../Constant";
import socket from "../../Socket";

const ChatPanel = () => {
  const closehistory = () => {
    document.querySelector(".history").classList.remove("show");
  };

  useEffect(() => {
    // if (username && room) {
    //   setUsername(username);
    //   setRoom(room);
    //   joinRoom(username, room);
    // }
    // socket.on("message", (message) => {
    //   setMessages((msgs) => [...msgs, message]);
    // });
    // return () => {
    //   socket.off("message");
    // };
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
        {/* {!joined ? (
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
        )} */}
      </div>
    </Fragment>
  );
};

export default ChatPanel;
