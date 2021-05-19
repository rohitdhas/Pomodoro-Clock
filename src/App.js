import "./styles.css";
import React from "react";

// Global Variables
let seconds;
let timeOutHanlde;
let isOn = false;
let timerStartDelay;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      isSession: true
    };

    this.countdown = this.countdown.bind(this);
    this.reset = this.reset.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
  }

  // functions to increment values
  sessionIncrement() {
    if (!isOn) {
      let sessionLength = this.state.sessionLength;

      if (sessionLength === 60) return;

      this.setState({ sessionLength: sessionLength + 1});
    }
    return;
  }

  breakIncrement() {
    if (!isOn) {
      let breakLength = this.state.breakLength;

      if (breakLength === 60) return;

      this.setState({ breakLength: breakLength + 1 });
    }
    return;
  }

  // functions to decrement values
  sessionDecrement() {
    if (!isOn) {
      let sessionLength = this.state.sessionLength;

      if (sessionLength === 1) return;
      this.setState({ sessionLength: sessionLength - 1 });
    }
    return;
  }

  breakDecrement() {
    if (!isOn) {
      let breakLength = this.state.breakLength;

      if (breakLength === 1) return;
      this.setState({ breakLength: breakLength - 1 });
    }
    return;
  }

  // Function to Reset all values to defalut
  reset() {
    this.setState({ sessionLength: 25, breakLength: 5 });
    this.setState({isSession: true});

    document.getElementById("time-left").innerHTML = `${this.state.sessionLength}:00`;
    document.getElementById('time-left').classList.remove('active');
    document.getElementById("beep").pause();
    clearTimeout(timeOutHanlde);
    timeOutHanlde = null;
    isOn = false;
  }

  start() {

    isOn = true;
    let sessionOrBreak;
    let timer = document.getElementById("time-left"); 
    let minutes = timer.innerHTML.split(":")[0];
    seconds = timeToSeconds(timer.innerHTML.split(":")); //Converting time to seconds by splitting minuites and seconds
    
    if (minutes === '00'){
      document.getElementById('time-left').classList.add('active');
    }

    if (seconds === 0) {
      if (this.state.isSession) {
        sessionOrBreak = this.state.breakLength;
        this.setState({isSession: false});
      } else {
        sessionOrBreak = this.state.sessionLength;
        this.setState({isSession: true});
      }

      document.getElementById("beep").play().catch(error => console.log(error));
      document.getElementById('time-left').classList.remove('active');
      timer.innerHTML = `${sessionOrBreak}:01`;
      clearTimeout(timeOutHanlde);
      return this.start(); 
    }
    seconds--;
    timer.innerHTML = secondsToTime(seconds);
    timeOutHanlde = setTimeout(this.start, 1000);
    
  }

  stop() {
    clearTimeout(timeOutHanlde);
    timeOutHanlde = null;
    isOn = false;
  }

  // ---Timer---
  countdown(){
    if (isOn) {
      this.stop();
      return;
    }
    clearTimeout(timerStartDelay);
    timerStartDelay = setTimeout(this.start, 1000);
  }

  render() {

    return (
      <div id="container">
        <h1 id="title">Pomodoro Clock</h1>
        <div id="label-wrapper">
          {/* Break Section */}
          <div id="break-label">
            <h3>Break Length</h3>
            <div className="in-dec-btns">
              <button onClick={this.breakIncrement} id="break-increment">
                +
              </button>
              <h3 id="break-length">{this.state.breakLength}</h3>
              <button onClick={this.breakDecrement} id="break-decrement">
                -
              </button>
            </div>
          </div>

          {/* Session Section*/}
          <div id="session-label">
            <h3>Session Length</h3>
            <div className="in-dec-btns">
              <button onClick={this.sessionIncrement} id="session-increment">
                +
              </button>
              <h3 id="session-length">{this.state.sessionLength}</h3>
              <button onClick={this.sessionDecrement} id="session-decrement">
                -
              </button>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div id="timer">
          <h2 id="timer-label">{this.state.isSession ? "Session": "Break"}</h2>
          <audio
            onPause = {(event) => event.target.currentTime = 0}
            id="beep"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
          <h1 id="time-left">{`${this.state.isSession ? this.state.sessionLength: this.state.breakLength}:00`}</h1>
          <div id="timer-btns">
            <button id="start_stop" onClick={this.countdown}>
              Start/Stop
            </button>
            <button onClick={this.reset} id="reset">
              Reset
            </button>
          </div>
        </div>

        <footer>
          <p>Designed and Coded by</p>
          <p><a rel="noreferrer" target='_blank' href="https://www.linkedin.com/in/rohit-dhas-26b68215a/">Rohit Dhas</a></p>
        </footer>
      </div>
    );
  }
}

// Function to convert time to seconds
function timeToSeconds(timeArray) {
  let minutes = timeArray[0] * 1;
  let seconds = minutes * 60 + timeArray[1] * 1;
  return seconds;
}

// Function to convert seconds to time
function secondsToTime(secs) {
  let divisor_for_minutes = secs % (60 * 60);

  let minutes = Math.floor(divisor_for_minutes / 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let divisor_for_seconds = divisor_for_minutes % 60;
  
  let seconds = Math.ceil(divisor_for_seconds);
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return minutes + ":" + seconds;
}
