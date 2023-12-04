import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/socketProvider";
import ReactPlayer from "react-player";
import "./Room.css";
import peer from "../service/peer";

const Room = () => {
  const socket = useSocket();
  const [socketId, setSocketId] = useState();
  const [myStream, setMyStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`${email}, ${id}`);
    setSocketId(id);
  });

  const sendStreams = useCallback(() => {
    if (myStream) {
      const senders = peer.peer.getSenders();

      const hasVideoTrack = senders.some(
        (sender) => sender.track && sender.track.kind === "video"
      );
      const hasAudioTrack = senders.some(
        (sender) => sender.track && sender.track.kind === "audio"
      );

      if (!hasVideoTrack) {
        const videoTrack = myStream.getVideoTracks()[0];
        if (videoTrack) {
          peer.peer.addTrack(videoTrack, myStream);
        }
      }

      if (!hasAudioTrack) {
        const audioTrack = myStream.getAudioTracks()[0];
        if (audioTrack) {
          peer.peer.addTrack(audioTrack, myStream);
        }
      }
    }
  }, [myStream, peer.peer]);

  const handleAutoConnect = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: socketId, offer });
    setMyStream(stream);
    sendStreams();
  }, [sendStreams]);

  useEffect(() => {
    handleAutoConnect();
  }, [handleAutoConnect]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: socketId });
  }, [socketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
      // Set remoteStreams array with the new remote stream
      setRemoteStreams((prevStreams) => [...prevStreams, { id: from, stream: ans }]);
    },
    [socket, socketId]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", (ev) => {
      const remoteStream = ev.streams;
      setRemoteStreams((prevStreams) => [...prevStreams, { id: socketId, stream: remoteStream[0] }]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [socket, handleUserJoined, handleCallAccepted, handleIncommingCall]);

  return (
    <div className="container2">
      <div className="video-container">
        <div className="myStream">
          {myStream && (
            <ReactPlayer
              width="100%"
              height="100%"
              style={{ borderRadius: "20px", backgroundColor: "#000" }}
              playing
              url={myStream}
            />
          )}
        </div>
        {remoteStreams.map((remoteUser) => (
          <div key={remoteUser.id} className="remoteStream">
            <ReactPlayer
              width="100%"
              height="100%"
              playing
              url={remoteUser.stream}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Room;
