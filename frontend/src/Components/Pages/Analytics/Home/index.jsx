import { Button, Col, Form, Input, Row } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { generateRandomString, socket_api } from "../../../../Constant";
import socket from "../../../Socket";
import axios from "axios";
const Home = () => {
  const [modal, setModal] = useState(false);
  const [roomID, setRoomID] = useState();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [form] = Form.useForm();
  const socketRef = React.useRef(null);
  const userID = JSON.parse(localStorage.getItem("userAuth"))._id;
  const createWorkspace = async () => {
    try {
      const values = await form.validateFields();

      let model = {
        roomName: values.roomName,
        roomID: values.roomID,
        createdUser: userID,
        roomPassword: values.password,
        users: [],
      };
      await axios
        .post(socket_api + "api/room/create", model)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {});
    } catch (err) {}
  };

  const getAllWorkspaces = async () => {
    let model = {
      userID: userID,
    };
    await axios
      .post(socket_api + "api/room/search", model)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {});
  };
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

  const handleJoin = () => {
    if (username && room) {
      // Store username and room in local storage
      //   localStorage.setItem("username", username);
      //   localStorage.setItem("room", room);
      joinRoom(username, room);
    }
  };
  // Retrieve stored user and room info from local storage
  const Username = localStorage.getItem("username");
  const Room = localStorage.getItem("room");

  const toggle = () => {
    setModal(!modal);
    const room = generateRandomString(12);
    setRoomID(room);
    form.setFieldValue("roomID", room);
  };
  useEffect(() => {
    getAllWorkspaces();
  }, []);
  return (
    <Fragment>
      <Row className="mt-3">
        <Col>
          <Button
            onClick={() => {
              toggle();
            }}
          >
            Create Workspace
          </Button>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Create Workspace</ModalHeader>
        <ModalBody>
          <Form form={form}>
            <Row>
              <Col md={11}>
                <FormGroup>
                  <Label>Workspace ID</Label>
                  <Form.Item name={"roomID"}>
                    <Input disabled type="text" maxLength={20} />
                  </Form.Item>
                </FormGroup>
              </Col>
              <Col md={2}></Col>
              <Col md={11}>
                <FormGroup>
                  <Label>Nick Name</Label>
                  <Form.Item name={"roomName"}>
                    <Input type="text" maxLength={20} />
                  </Form.Item>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={11}>
                <FormGroup>
                  <Label>Password</Label>
                  <Form.Item name={"password"}>
                    <Input type="password" />
                  </Form.Item>
                </FormGroup>
              </Col>
              <Col md={2}></Col>
              <Col md={11}>
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <Form.Item name={"cPassword"}>
                    <Input type="password" />
                  </Form.Item>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              createWorkspace();
            }}
            type="primary"
            color="primary"
          >
            Create
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};
export default Home;
