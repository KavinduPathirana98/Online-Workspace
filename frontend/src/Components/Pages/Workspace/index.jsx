import {
  AppstoreOutlined,
  EditOutlined,
  FileOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Button, Col, Modal, Row } from "antd";
import { Fragment, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import JitsiMeetingComponent from "../Meet";
import SvgIcon from "../../Common/Component/SvgIcon";
import socket from "../../Socket";
import { useWebSocket, WebSocketProvider } from "../../Socket/WebSocketContext";

const BlockEditor = ({
  setBlocks,
  blocks,
  container,
  handleAddBlock,
  blockType,
  setBlockType,
  content,
  setContent,
}) => {
  return (
    <div className="block-editor">
      <select onChange={(e) => setBlockType(e.target.value)} value={blockType}>
        <option value="notepad">Notepad</option>
        <option value="image">Image</option>
      </select>
      {blockType === "notepad" ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your note here..."
        />
      ) : (
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter image URL here..."
        />
      )}
      <button onClick={() => handleAddBlock()}>Add Block</button>
    </div>
  );
};

const BlockDisplay = ({ blocks }) => {
  return (
    <div className="block-display">
      {blocks &&
        blocks.map((block) => (
          <div key={block.id} className="block">
            {block.type === "notepad" ? (
              <div className="notepad">{block.content}</div>
            ) : (
              <div className="image">
                <img src={block.content} alt="user uploaded" />
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
const Workspace = () => {
  const [modal, setModal] = useState(false);
  const [components, setComponents] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const container = [];

  const [blockType, setBlockType] = useState("notepad");
  const [content, setContent] = useState("");
  const handleAddBlock = () => {
    const newBlock = {
      id: uuidv4(),
      type: blockType,
      content,
    };
    container.push(newBlock);
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    //setBlocks(container);
    console.log("container", container);
    setContent("");
    socket.emit("block", container);
    // Listen for initial blocks from the server
    // socket.on("initial", (data) => {
    //   console.log(data);
    //   setBlocks(data.blocks);
    // });
    // Listen for new blocks being added
    socket.on("block", blocks);
  };

  // Establish WebSocket connection and handle incoming messages
  useEffect(() => {});

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
            selectItem("other");
          }}
        >
          <Col span={4}>
            <AppstoreOutlined style={{ fontSize: "24px" }} />
          </Col>
          <Col span={20}>
            <div>Other</div>
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
      />
      <BlockDisplay blocks={blocks} />
    </Fragment>
  );
};

export default Workspace;
