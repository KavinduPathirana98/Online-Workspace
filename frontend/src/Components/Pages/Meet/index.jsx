import React, { useState, useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import SvgIcon from "../../Common/Component/SvgIcon";

const JitsiMeetingComponent = ({ meetingStarted, setMeetingStarted }) => {
  const pipRef = useRef(null);

  const handleDrag = (e) => {
    if (e.buttons !== 1) {
      stopDragging();
      return;
    }

    pipRef.current.style.left = `${
      e.clientX - pipRef.current.offsetWidth / 2
    }px`;
    pipRef.current.style.top = `${
      e.clientY - pipRef.current.offsetHeight / 2
    }px`;
  };

  const stopDragging = () => {
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDragging);
  };

  const startDragging = (e) => {
    if (e.button === 0) {
      e.preventDefault();
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", stopDragging);
    }
  };

  const startMeeting = () => {
    setMeetingStarted(true);
  };

  const closeMeeting = () => {
    setMeetingStarted(false); // Stops the meeting
  };

  const user =
    JSON.parse(localStorage.getItem("userAuth")).fName +
    " " +
    JSON.parse(localStorage.getItem("userAuth")).lName;

  return (
    <div>
      {/* Conditionally render the JitsiMeeting component */}
      {meetingStarted && (
        <div
          ref={pipRef}
          onMouseDown={startDragging}
          style={{
            position: "fixed",
            width: "400px",
            height: "400px",
            bottom: "10px",
            right: "10px",
            border: "1px solid #ccc",
            zIndex: 1000,
            cursor: "move",
            backgroundColor: "white",
          }}
        >
          {/* Close button */}
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              cursor: "pointer",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              zIndex: 1001,
            }}
            onClick={closeMeeting}
          >
            X
          </div>

          <JitsiMeeting
            domain="meet.jit.si"
            roomName={localStorage.getItem("room")}
            configOverwrite={{
              startWithAudioMuted: true,
              startWithVideoMuted: true,
            }}
            interfaceConfigOverwrite={{
              TOOLBAR_BUTTONS: ["microphone", "camera", "chat"],
            }}
            userInfo={{
              displayName: user,
            }}
            onApiReady={(externalApi) => {
              // You can store the API instance and call methods on it later.
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default JitsiMeetingComponent;
