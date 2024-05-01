import axios from "axios";
import {
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import React, { Fragment, useState, useEffect } from "react";
import { PlusSquare, Upload } from "react-feather";
import errorImg from "../../../assets/images/search-not-found.png";
import { toast } from "react-toastify";
import { H4, H6, LI, P, UL, Image } from "../../../AbstractElements";
import { CardBody, CardHeader, Form, Input, Media } from "reactstrap";

const FileManager = ({ socket, fileNames, setFileNames }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };
  const handleDownload = async (file) => {
    try {
      // const fileName = "example.txt"; // Change to the file name you want to download
      const response = await fetch(
        `http://localhost:5000/download/?fileName=${file}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const getFile = () => {
    document.getElementById("upfile").click();
  };
  return (
    <div>
      <CardHeader>
        <Media>
          <Form className="search-file form-inline">
            <div className="mb-0 form-group">
              <i className="fa fa-search"></i>
              <input
                className="form-control-plaintext"
                type="text"
                //value={searchTerm}
                onChange={(e) => handleFileChange(e)}
                placeholder="Search..."
              />
            </div>
          </Form>
          <Media body className="text-end">
            <Form className="d-inline-flex">
              <div className="btn btn-primary" onClick={getFile}>
                Add New
              </div>
              <div style={{ height: "0px", width: "0px", overflow: "hidden" }}>
                <Input
                  id="upfile"
                  multiple
                  type="file"
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
            </Form>
            <div
              className="btn btn-outline-primary ms-2"
              onClick={handleUpload}
            >
              {"Upload"}
            </div>
          </Media>
        </Media>
      </CardHeader>
      {/* <CardBody className="file-manager">
        <H4 attrH4={{ className: "mb-3" }}>All Files</H4>{" "}
        <H6>Recently Opened Files</H6>
        <UL attrUL={{ className: "simple-list files" }}> {"filelist"}</UL>
        <H6 attrH6={{ className: "mt-4" }}>Folders</H6>
        <UL attrUL={{ className: "simple-list folder" }}>
          {fileNames.map((item) => {
            return (
              <LI attrLI={{ className: "folder-box" }} key={item.id}>
                <Media>
                  <i className={item.folderclass}></i>
                  <Media body className=" ms-3">
                    <H6 attrH6={{ className: "mb-0" }}>{item.title}</H6>
                    <P>{item.foldersize}</P>
                  </Media>
                </Media>
              </LI>
            );
          })}
        </UL>
        <H6 attrH6={{ className: "mt-4" }}>Files</H6>
        <UL attrUL={{ className: "simple-list files" }}>{filelist} </UL>
      </CardBody> */}
      {/* <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div className="row">
        <div className="col-md-12">
          {fileNames.map((file) => {
            return (
              <div>
                {file.includes("pdf") ? (
                  <>
                    <FilePdfOutlined />
                    <a> {file}</a>
                  </>
                ) : file.includes("docx") ? (
                  <div
                    className="container mt-3 mb-3"
                    style={{
                      radiu: "5%",
                      borderColor: "black",
                      border: "1px solid black",
                      padding: "5px",
                    }}
                  >
                    <>
                      <FileTextOutlined style={{ fontSize: "300%" }} />{" "}
                      <a
                        onClick={() => {
                          handleDownload(file);
                        }}
                      >
                        {file}
                      </a>
                    </>
                  </div>
                ) : file.includes("png") ||
                  file.includes("jpg") ||
                  file.includes("jpeg") ? (
                  <>
                    <FileImageOutlined style={{ fontSize: "150%" }} />{" "}
                    <a
                      onClick={() => {
                        handleDownload(file);
                      }}
                    >
                      {file}
                    </a>
                  </>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div> */}
      <div className="row">
        <div className="col-md-12">
          {fileNames.map((file) => {
            return (
              <div>
                {file.includes("pdf") ? (
                  <>
                    <FilePdfOutlined />
                    <a> {file}</a>
                  </>
                ) : file.includes("docx") ? (
                  <div
                    className="container mt-3 mb-3"
                    style={{
                      radiu: "5%",
                      borderColor: "black",
                      border: "1px solid black",
                      padding: "5px",
                    }}
                  >
                    <>
                      <FileTextOutlined style={{ fontSize: "300%" }} />{" "}
                      <a
                        onClick={() => {
                          handleDownload(file);
                        }}
                      >
                        {file}
                      </a>
                    </>
                  </div>
                ) : file.includes("png") ||
                  file.includes("jpg") ||
                  file.includes("jpeg") ? (
                  <>
                    <FileImageOutlined style={{ fontSize: "150%" }} />{" "}
                    <a
                      onClick={() => {
                        handleDownload(file);
                      }}
                    >
                      {file}
                    </a>
                  </>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
