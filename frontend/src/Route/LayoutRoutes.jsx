import React, { Fragment, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./Routes";
import AppLayout from "../Layout/Layout";
import { socket_api } from "../Constant";
import { io } from "socket.io-client";
import socket from "../Components/Socket";

const LayoutRoutes = () => {
  const [current, setCurrent] = useState("1");
  // const [socket, setSocket] = useState(null);
  const [elements, setElements] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [inx, setInx] = useState("");
  useEffect(() => {
    // const server = socket_api;
    // const connectionOptions = {
    //   "force new connection": true,
    //   reconnectionAttempts: "Infinity",
    //   timeout: 10000,
    //   transports: ["websocket"],
    // };
    // //Create Socket
    // const socket = io(server, connectionOptions);

    //setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to socket.io server!");
    });
    //Join backend socket using keys
    socket.on("servedElements", (elementsCopy) => {
      setElements(elementsCopy.elements);
    });
    socket.on("text", (data) => {
      console.log("d", data);

      setInx(data);
    });

    // Event listener for 'fileList' event received from the server
    socket.on("fileList", (data) => {
      // Update state with received file names
      setFileNames(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <Routes>
        {routes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<AppLayout />} key={i}>
              <Route
                path={path}
                element={
                  <Component
                    // socket={socket}
                    elements={elements}
                    setElements={setElements}
                    fileNames={fileNames}
                    setFileNames={setFileNames}
                    inx={inx}
                    setInx={setInx}
                  />
                }
              />
            </Route>
          </Fragment>
        ))}
      </Routes>
    </>
  );
};

export default LayoutRoutes;
