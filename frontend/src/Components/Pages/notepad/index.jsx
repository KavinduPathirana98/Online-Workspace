import { useState } from "react";
import socket from "../../Socket";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import {
  FormGroup,
  Label,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { useForm } from "antd/es/form/Form";
import { socket_api } from "../../../Constant";
import axios from "axios";
import { toast } from "react-toastify";
const NotePad = ({ inx, setInx }) => {
  //const [inx, setInx] = useState("");

  const updateText = (text) => {
    console.log(text);
    setInx(text);
    socket.emit("text", text);
  };

  const fontFamilies = [
    { font: "Algerian" },
    { font: "Arial" },
    { font: "Calibri" },
    { font: "Cambria" },
  ];
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [modal, setModal] = useState(false);
  const [form] = useForm();
  const toggle = async () => {
    try {
      const formVal = await form.validateFields();
      console.log(formVal);
      const response = await axios.post(socket_api + "save-text", {
        text: inx,
        filename: formVal.filename,
        roomID: localStorage.getItem("room"),
      });
      toast.success("File successfully saved");
    } catch (err) {
      toast.error("Error while saving... please try again");
      console.log(err);
    }
  };
  return (
    <div className="container">
      <br></br>
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-2">
              <label style={{ fontSize: "15px" }} className="mt-2">
                Font
              </label>
            </div>
            <div className="col-md-4">
              <select
                className="form-control"
                onChange={(e) => {
                  setSelectedFont(e.target.value);
                }}
              >
                {fontFamilies.map((item) => {
                  return (
                    <option
                      value={item.font}
                      style={{ fontFamily: `${item.font}` }}
                    >
                      {item.font}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-2">
              <label style={{ fontSize: "15px" }} className="mt-2">
                File Name
              </label>
            </div>
            <div className="col-md-4">
              <Form form={form}>
                <Form.Item name="filename">
                  <input type="text" className="form-control" />
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <Button className="btn btn-primary" onClick={() => toggle()}>
        Save as a File
      </Button>
      <br></br>
      <br></br>
      <textarea
        style={{
          width: "100%",
          height: "1000px",
          borderColor: "white",
          border: "none",
          outline: "none",
          fontSize: "25px",
          fontFamily: `${selectedFont}`,
        }}
        type="text"
        id="inx"
        value={inx}
        onChange={(e) => {
          updateText(e.target.value);
        }}
      ></textarea>
    </div>
  );
};
export default NotePad;
