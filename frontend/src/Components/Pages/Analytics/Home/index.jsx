import { Button, Form, Input } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  CardBody,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Col,
  Row,
} from "reactstrap";
import { generateRandomString, socket_api } from "../../../../Constant";
import socket from "../../../Socket";
import axios from "axios";
import { Btn, H3, LI, UL } from "../../../../AbstractElements";
import moment from "moment";
const Home = () => {
  const [modal, setModal] = useState(false);
  const [roomID, setRoomID] = useState();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  const [myRooms, setMyRooms] = useState([]);
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
        if (response.data.code == 1) {
          console.log("rooms", response.data.data[0]);
          setMyRooms(response.data.data[0]);
        } else {
        }
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
      //   localStorage.setItem("room", room);+
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

      <CardBody>
        <Row className="pricing-block">
          {myRooms.map((item) => {
            console.log(item);
            return (
              <Col lg="3" md="6">
                <div className="pricingtable">
                  <div className="pricingtable-header">
                    <H3 attrH3={{ className: "title" }}>{item.roomName}</H3>
                  </div>
                  <div className="price-value">
                    <span className="currency">{"$"}</span>
                    <span className="amount">{"10"}</span>
                    <span className="duration">{"/mo"}</span>
                  </div>
                  <UL attrUL={{ className: " flex-row" }}>
                    <LI attrLI={{ className: "border-0" }}>
                      {"Workspace ID :" + item.roomID}
                    </LI>
                    <LI attrLI={{ className: "border-0" }}>
                      {"50 Email Accounts"}
                    </LI>
                    <LI attrLI={{ className: "border-0" }}>{"Maintenance"}</LI>
                    <LI attrLI={{ className: "border-0" }}>
                      {"Created Date : " +
                        moment(item.CreatedOn).format("yyyy-MMM")}
                    </LI>
                  </UL>
                  <div className="pricingtable-signup">
                    <Btn attrBtn={{ color: "primary", size: "lg" }}>
                      {"Join"}
                    </Btn>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </CardBody>
    </Fragment>
  );
};
export default Home;
