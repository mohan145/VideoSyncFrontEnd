import React from "react";
import ReactPlayer from "react-player";
import "./App.css";
import io from "socket.io-client";
require("dotenv").config();


class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      playing:false
    };
    this.socket=null;
    this.BACKEND_URL="http://127.0.0.1:4000/";
  }


  componentDidMount() {

    console.log(this.BACKEND_URL);
    
    this.socket=io(this.BACKEND_URL);
    console.log(this.socket);
    
    this.socket.on("message",(data)=>{
      this.setState({
        url:data.url
      })
    })

    this.socket.on("pause",data=>{
      console.log("recieved pause");
      console.log(this.state.playing);
      this.setState({playing:false});
      console.log(this.state.playing);
    })

    this.socket.on("play",(data)=>{
      console.log("recieved play");
      this.setState({playing:true});
    })

    this.socket.on("seekTo",(data)=>{
      console.log(data);
      
      this.player.seekTo(data.duration,"seconds");
    })

  }

  ref=player=>{
    this.player=player
  }

  render() {
    return (
      <div className="App">
        
        <ReactPlayer 
          controls
          ref={this.ref}
          playing={this.state.playing}
          url={this.state.url}
          onReady={() => {
          }}
          onStart={() => {
          }}
          onPause={() => {
            console.log("on Pause");
            this.socket.emit("pause",{"msg":"Pause"});
          }}
          onPlay={() => {
            console.log("on Play");
            this.socket.emit("play",{"msg":"Play"});
          }}
          onSeek={(e)=>{
            console.log(e);
            this.socket.emit("seekTo",{"duration":e});
          }}
        />
      </div>
    );
  }
}

export default App;

