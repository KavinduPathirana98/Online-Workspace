import axios from "axios";
import {
  socket_api,
  TodayProgressMessage,
  TodayProgressTitle,
} from "../../../../Constant";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { H5 } from "../../../../AbstractElements";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const Dashboard = () => {
  const [room, setRoom] = useState("");
  const [totalActive, setTotalActive] = useState(0);
  const [totalContribution, setTotalContribution] = useState(0);
  console.log(totalActive);
  console.log(totalContribution);
  const getRoomDetails = async () => {
    try {
      axios
        .get(socket_api + `api/room/get/${localStorage.getItem("room")}`)
        .then((response) => {
          console.log(response.data.data);
          response.data.data &&
            response.data.data[0].users &&
            response.data.data[0].users.map((item) => {
              setTotalActive((prev) => prev + item.onlineTime);
              setTotalContribution((prev) => prev + item.blockCount);
            });
          setRoom(response.data.data);
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getRoomDetails();
  }, []);
  return (
    <div>
      <Row>
        {room &&
          room[0].users.map((item) => {
            return (
              <Card className="get-card">
                <CardHeader className="card-no-border">
                  <H5>{"Workspace Progress"}</H5>
                  <span className="f-14 f-w-500 f-light">
                    {"Workspace Progress"}
                  </span>
                </CardHeader>
                <br></br>
                <CardBody className="pt-0">
                  <div className="progress-chart-wrap">
                    <Row>
                      <Col md={2}>
                        <div
                        //   style={{ height: "50%", width: "50%" }}
                        >
                          <CircularProgressbar
                            value={(item.onlineTime / totalActive) * 100}
                            text={`${(item.onlineTime / totalActive) * 100}`}
                          />
                        </div>
                      </Col>
                      <Col md={2}>
                        <div
                          style={
                            {
                              // height: "50%",
                              // width: "50%",
                              //marginLeft: "-50%",
                            }
                          }
                        >
                          <CircularProgressbar
                            styles={buildStyles({
                              textColor: "red",
                              pathColor: "red",
                            })}
                            value={84}
                            text={"84%"}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            );
          })}
      </Row>
    </div>
  );
};
export default Dashboard;
