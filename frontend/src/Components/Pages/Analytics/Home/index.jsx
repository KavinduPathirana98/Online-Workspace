import { Button, Form, Input, Select } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import React, { Fragment, useEffect, useRef, useState } from "react";
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
import { Breadcrumbs, Btn, H3, LI, UL } from "../../../../AbstractElements";
import moment from "moment";

const Home = () => {
  const [modal, setModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [roomID, setRoomID] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [myRooms, setMyRooms] = useState([]);
  const [mousePositions, setMousePositions] = useState({});
  const [form] = Form.useForm();
  const [formSettings] = Form.useForm();
  const socketRef = useRef(null);
  const userID = JSON.parse(localStorage.getItem("userAuth"))._id;
  const Username = JSON.parse(localStorage.getItem("userAuth")).email;

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
      await axios.post(socket_api + "api/room/create", model);
    } catch (err) {
      console.error(err);
    }
  };

  const [allUsers, setAllUsers] = useState([]);

  const getallUsers = async () => {
    await axios.get(socket_api + "api/user/", {}).then((response) => {
      if (response.data.code === 1) {
        const data = response.data.data.map((item) => {
          return {
            label: item.fName + " " + item.lName,
            value: item._id,
          };
        });
        setAllUsers(data);
      }
    });
  };

  const getAllWorkspaces = async () => {
    let model = { userID: userID };
    await axios
      .post(socket_api + "api/room/search", model)
      .then((response) => {
        if (response.data.code === 1) {
          console.log(response.data.data[0]);
          setMyRooms(response.data.data[0]);
        }
      })
      .catch((error) => console.error(error));
  };

  const joinRoom = (roomID) => {
    if (Username && roomID) {
      socket.emit("joinRoom", { username: Username, room: roomID });
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

  const toggle = () => {
    setModal(!modal);
    const room = generateRandomString(12);
    setRoomID(room);
    form.setFieldValue("roomID", room);
  };

  const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    socket.emit("down", { x, y, email: Username });
  };
  useEffect(() => {
    socket.on("ondown", (data) => {
      setMousePositions((prevPositions) => ({
        ...prevPositions,
        [data.email]: { x: data.x, y: data.y },
      }));
    });

    return () => {
      socket.off("ondown");
    };
  }, []);
  const toggleSettings = () => {
    setSettingsModal(!settingsModal);
  };
  useEffect(() => {
    getAllWorkspaces();
    getallUsers();
  }, []);
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Home" title="Home" />
      <div
        onMouseMove={handleMouseMove}
        style={{ position: "relative", width: "100%", height: "100vh" }}
      >
        {Object.keys(mousePositions).map((email) => {
          const pos = mousePositions[email];
          return (
            <div
              key={email}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                backgroundColor: "blue",
                color: "white",
                padding: "2px 5px",
                borderRadius: "3px",
                transform: "translate(-50%, -50%)",
                zIndex: 10000,
              }}
            >
              {email}
            </div>
          );
        })}

        <Row className="mt-3 mb-3">
          <Col>
            <Button onClick={toggle}>Create Workspace</Button>
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
            <Button onClick={createWorkspace} type="primary" color="primary">
              Create
            </Button>
          </ModalFooter>
        </Modal>
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
            <Button onClick={createWorkspace} type="primary" color="primary">
              Create
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={settingsModal} toggle={toggleSettings}>
          <ModalHeader>Update Members</ModalHeader>
          <ModalBody>
            <Form form={formSettings}>
              <Row>
                <Col md={11}>
                  <FormGroup>
                    <Label>Users</Label>
                    <Form.Item name={"users"}>
                      <Select
                        mode="multiple"
                        allowClear
                        style={{
                          width: "100%",
                        }}
                        placeholder="Please select"
                        // defaultValue={['a10', 'c12']}
                        onChange={handleChange}
                        options={allUsers}
                      />
                    </Form.Item>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button type="primary" color="primary">
              Update Members
            </Button>
            <Button type="primary" color="primary">
              Delete Room
            </Button>
          </ModalFooter>
        </Modal>
        <CardBody>
          <Row className="pricing-block">
            {myRooms.map((item) => (
              <Col lg="3" md="6" key={item.roomID}>
                <div className="pricingtable">
                  {item.createdUser ===
                  JSON.parse(localStorage.getItem("userAuth"))._id ? (
                    <Row>
                      <Col md={8}></Col>
                      <Col md={3}>
                        <Button title="settings" onClick={toggleSettings}>
                          <TeamOutlined />
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}

                  <div className="pricingtable-header">
                    <H3 attrH3={{ className: "title" }}>{item.roomName}</H3>
                  </div>
                  <div className="price-value">
                    {/* <span className="currency">$</span>
                    <span className="amount">10</span>
                    <span className="duration">/mo</span> */}
                  </div>
                  <UL attrUL={{ className: " flex-row" }}>
                    <LI attrLI={{ className: "border-0" }}>
                      {"Workspace ID :" + item.roomID}
                    </LI>
                    {/* <LI attrLI={{ className: "border-0" }}>
                      {"50 Email Accounts"}
                    </LI>
                    <LI attrLI={{ className: "border-0" }}>{"Maintenance"}</LI> */}
                    <LI attrLI={{ className: "border-0" }}>
                      {"Created Date : " +
                        moment(item.CreatedOn).format("YYYY-MMM")}
                    </LI>
                  </UL>
                  <div className="pricingtable-signup">
                    <Btn
                      attrBtn={{
                        color: "primary",
                        size: "lg",
                        onClick: () => joinRoom(item.roomID),
                      }}
                    >
                      Join
                    </Btn>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </div>
    </Fragment>
  );
};

export default Home;
