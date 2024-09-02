import {
  AppstoreOutlined,
  EditOutlined,
  FileOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Button, Col, Modal, Row } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import JitsiMeetingComponent from "../Meet";
import SvgIcon from "../../Common/Component/SvgIcon";
import socket from "../../Socket";
import { useWebSocket, WebSocketProvider } from "../../Socket/WebSocketContext";
import { socket_api } from "../../../Constant";
import axios from "axios";

//UI Component for add new blocks
const BlockEditor = ({
  setBlocks,
  blocks,
  container,
  handleAddBlock,
  blockType,
  setBlockType,
  content,
  setContent,
  base64Image,
  setBase64Image,
  imageName,
  setImageName,
  handleImageUpload,
  base64PDF,
  setBase64PDF,
}) => {
  return (
    <div className="block-editor">
      {blockType === "notepad" ? (
        <div>
          <Row>
            <Col md={23}></Col>
            <Col md={1}>
              <Button onClick={() => handleAddBlock()}>Add</Button>
            </Col>
          </Row>
          <textarea
            style={{
              width: "100%",
              height: "100px",
              borderColor: "white",
              border: "none",
              outline: "none",
              fontSize: "25px",
              //fontFamily: `${selectedFont}`,
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note here..."
          />
        </div>
      ) : blockType === "pdf" ? (
        <div>
          <Row>
            <Col md={23}></Col>
            <Col md={1}>
              <Button onClick={() => handleAddBlock()}>Add</Button>
            </Col>
          </Row>
          <input type="file" accept="pdf/*" onChange={handleImageUpload} />
          {base64PDF && (
            <div>
              <iframe
                src={base64PDF}
                title="PDF Document"
                width="100%"
                height="600px"
                style={{ border: "1px solid #ccc" }}
              ></iframe>
            </div>
          )}
        </div>
      ) : blockType === "image" ? (
        <div>
          <Row>
            <Col md={23}></Col>
            <Col md={1}>
              <Button onClick={() => handleAddBlock()}>Add</Button>
            </Col>
          </Row>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {base64Image && (
            <div>
              <img
                src={base64Image}
                alt={imageName}
                style={{ maxWidth: "300px", marginTop: "10px" }}
              />
            </div>
          )}
        </div>
      ) : (
        ""
      )}
      {/* <button onClick={() => handleAddBlock()}>Add Block</button> */}
    </div>
  );
};

//Display Block Component
const BlockDisplay = ({ blocks }) => {
  return (
    <div className="block-display">
      {blocks &&
        blocks.map((block) => (
          <div key={block.id} className="block">
            {block.type === "notepad" ? (
              <div>
                {block.user ===
                JSON.parse(localStorage.getItem("userAuth"))._id ? (
                  <Row>
                    <Col md={23}></Col>
                    <Col md={1}>
                      <Button onClick={() => {}}>Delete</Button>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}

                <div className="notepad">{block.content}</div>
              </div>
            ) : block.type === "image" ? (
              <div>
                {block.user ===
                JSON.parse(localStorage.getItem("userAuth"))._id ? (
                  <Row>
                    <Col md={23}></Col>
                    <Col md={1}>
                      <Button onClick={() => {}}>Delete</Button>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}

                <div className="image">
                  <img src={block.content} alt="user uploaded" />
                </div>
              </div>
            ) : block.type === "pdf" ? (
              <div>
                {block.user ===
                JSON.parse(localStorage.getItem("userAuth"))._id ? (
                  <Row>
                    <Col md={23}></Col>
                    <Col md={1}>
                      <Button onClick={() => {}}>Delete</Button>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}

                <iframe
                  src={block.content}
                  title="PDF Document"
                  width="100%"
                  height="600px"
                  style={{ border: "1px solid #ccc" }}
                ></iframe>
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
    </div>
  );
};
//Main Component Workspace
const Workspace = () => {
  const [modal, setModal] = useState(false);
  const [components, setComponents] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const container = [];
  const [base64Image, setBase64Image] = useState("");
  const [imageName, setImageName] = useState("");
  const [blockType, setBlockType] = useState("notepad");
  const [content, setContent] = useState("");
  const [base64PDF, setBase64PDF] = useState("");
  let blockCount =
    localStorage.getItem("roomDetails") &&
    JSON.parse(localStorage.getItem("roomDetails"))[0].users.filter(
      (user) =>
        user.user._id === JSON.parse(localStorage.getItem("userAuth"))._id
    )[0].blockCount;
  const updateBlockCount = () => {
    axios
      .put(
        socket_api +
          `api/room/update-block-count/${localStorage.getItem("room")}/${
            JSON.parse(localStorage.getItem("userAuth"))._id
          }`,
        { blockCount }
      )
      .then((response) => {});
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageName(file.name);
      const reader = new FileReader();

      reader.onloadend = () => {
        setBase64Image(reader.result);
        setBase64PDF(reader.result);
        setContent(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleAddBlock = () => {
    const newBlock = {
      user: JSON.parse(localStorage.getItem("userAuth"))._id,
      id: uuidv4(),
      type: blockType,
      content,
    };
    container.push(newBlock);
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    //setBlocks(container);
    console.log("clock", blocks);
    setContent("");

    socket.emit("block", blocks);
    updateBlockCount();
  };

  // Establish WebSocket connection and handle incoming messages
  useEffect(() => {
    socket.on("block", (bl) => {
      console.log(bl);
      setBlocks(bl);
    });
    //socket.on("block", blocks);
  }, [blocks]);

  // Function to add a new component block
  const addComponent = (type) => {
    const newComponent = {
      id: Date.now(),
      type,
      content: "",
      editable: true,
    };

    // Update local state and send new component to WebSocket server
    setComponents((prev) => [...prev, newComponent]);
    setSelectedOption(null);
    socket.send(JSON.stringify(newComponent));
  };

  // Function to save the component and lock editing
  const saveComponent = (id, content) => {
    const updatedComponent = {
      id,
      content,
      editable: false,
    };

    // Update local state and send updated component to WebSocket server
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, content, editable: false } : comp
      )
    );
    socket.send(JSON.stringify(updatedComponent));
  };

  const selectItem = (item) => {
    setBlockType(item);
    setModal(false);
  };
  return (
    <Fragment>
      <Button type="primary" onClick={() => setModal(true)}>
        Open Modal
      </Button>
      <Modal
        title="Options"
        centered
        open={modal}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
      >
        <Row
          style={{
            padding: "10px",
            border: "1px solid black",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          onClick={() => {
            selectItem("notepad");
          }}
        >
          <Col span={4}>
            <FileOutlined style={{ fontSize: "24px" }} />
          </Col>
          <Col span={20}>
            <div>Notepad</div>
          </Col>
        </Row>

        <Row
          style={{
            padding: "10px",
            border: "1px solid black",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          onClick={() => {
            selectItem("image");
          }}
        >
          <Col span={4}>
            <PictureOutlined style={{ fontSize: "24px" }} />
          </Col>
          <Col span={20}>
            <div>Image</div>
          </Col>
        </Row>

        <Row
          style={{
            padding: "10px",
            border: "1px solid black",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          onClick={() => {
            selectItem("whiteboard");
          }}
        >
          <Col span={4}>
            <EditOutlined style={{ fontSize: "24px" }} />
          </Col>
          <Col span={20}>
            <div>Whiteboard</div>
          </Col>
        </Row>

        <Row
          style={{
            padding: "10px",
            border: "1px solid black",
            borderRadius: "5px",
          }}
          onClick={() => {
            selectItem("pdf");
          }}
        >
          <Col span={4}>
            <AppstoreOutlined style={{ fontSize: "24px" }} />
          </Col>
          <Col span={20}>
            <div>PDF</div>
          </Col>
        </Row>
      </Modal>

      {selectedOption && (
        <div className="modal">
          <p>Selecting: {selectedOption}</p>
          <button onClick={() => addComponent(selectedOption)}>Confirm</button>
        </div>
      )}

      <BlockEditor
        setBlocks={setBlocks}
        blocks={blocks}
        container={container}
        handleAddBlock={handleAddBlock}
        blockType={blockType}
        setBlockType={setBlockType}
        content={content}
        setContent={setContent}
        base64Image={base64Image}
        setBase64Image={setBase64Image}
        handleImageUpload={handleImageUpload}
        imageName={imageName}
        setImageName={setImageName}
        base64PDF={base64PDF}
        setBase64PDF={setBase64PDF}
      />
      <BlockDisplay blocks={blocks} />
    </Fragment>
  );
};

export default Workspace;
