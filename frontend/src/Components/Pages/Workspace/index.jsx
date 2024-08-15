import {
  AppstoreOutlined,
  EditOutlined,
  FileOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Button, Col, Modal, Row } from "antd";
import { Fragment, useState } from "react";

import JitsiMeetingComponent from "../Meet";
import SvgIcon from "../../Common/Component/SvgIcon";

const Workspace = () => {
  const [modal, setModal] = useState(false);
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
        >
          <Col span={4}>
            <AppstoreOutlined style={{ fontSize: "24px" }} />
          </Col>
          <Col span={20}>
            <div>Other</div>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  );
};
export default Workspace;
