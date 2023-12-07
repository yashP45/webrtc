import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
const Lobby = () => {
  const [email, setEmail] = useState();
  const [room, setRoom] = useState();
  const navigate = useNavigate();
  //   const handleSubmit = useCallback(
  //     (e) => {
  //       e.preventDefault();
  //       socket.emit("join", { email, room });
  //     },
  //     [email, room, socket]
  //   );
  //   const handleJoinRoom = useCallback(
  //     (data) => {
  //       const { email, room } = data;
  //       navigate(`/room/${room}`);
  //     },
  //     [navigate]
  //   );

  //   useEffect(() => {
  //     socket.on("join", handleJoinRoom);
  //     return () => {
  //       socket.off("join", handleJoinRoom);
  //     };
  //   }, [socket]);
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            placeholder="Room "
            onChange={(e) => setRoom(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Lobby;
