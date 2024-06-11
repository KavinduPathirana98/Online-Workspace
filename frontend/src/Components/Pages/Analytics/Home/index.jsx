import { Button, Col, Form, Input, Row } from "antd";
import React, { Fragment, useState } from "react";
import {
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { generateRandomString } from "../../../../Constant";
import socket from "../../../Socket";

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
      localStorage.setItem("username", username);
      localStorage.setItem("room", room);
      joinRoom(username, room);
    }
  };
  // Retrieve stored user and room info from local storage
  const Username = localStorage.getItem("username");
  const Room = localStorage.getItem("room");
  const toggle = () => {
    setModal(!modal);
    setRoomID(generateRandomString(12));
  };
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
          <Form>
            <Row>
              <Col md={11}>
                <FormGroup>
                  <Label>Workspace ID</Label>
                  <Form.Item>
                    <Input value={roomID} disabled type="text" maxLength={20} />
                  </Form.Item>
                </FormGroup>
              </Col>
              <Col md={2}></Col>
              <Col md={11}>
                <FormGroup>
                  <Label>Nick Name</Label>
                  <Form.Item>
                    <Input type="text" maxLength={20} />
                  </Form.Item>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={11}>
                <FormGroup>
                  <Label>Password</Label>
                  <Form.Item>
                    <Input type="password" />
                  </Form.Item>
                </FormGroup>
              </Col>
              <Col md={2}></Col>
              <Col md={11}>
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <Form.Item>
                    <Input type="password" />
                  </Form.Item>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button type="primary" color="primary">
            Create
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};
export default Home;
