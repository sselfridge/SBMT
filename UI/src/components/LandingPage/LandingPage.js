import React, { Component } from "react";
// import { Route } from "react-router";
// import { Layout } from "./components/Layout";
// import { Home } from "./components/Home";
// import { FetchData } from "./components/FetchData";
// import { Counter } from "./components/Counter";

// import './custom.css'
import "./mein.css";
import { Link } from "react-router-dom";
import { formatDuration, intervalToDuration } from "date-fns";

import { ReactComponent as LogoV1 } from "./assets/logoV1.svg";
import { ReactComponent as Insta } from "./assets/insta.svg";
import { ReactComponent as StravaLogo } from "./assets/stravaLogo.svg";

const targetMap = {
  infoBtn: "infoSection",
  // contributeBtn: "contributeSection",
  contributeBtn2: "contributeSection",
};

export default class App extends Component {
  static displayName = App.name;

  componentDidMount() {
    const btns = Object.keys(targetMap);

    const scrollToArea = (e) => {
      const id = targetMap[e.target.id];
      document
        .getElementById(id)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    };
    // const onTextChange = () => {
    //   const ta = document.getElementById("textArea");
    //   const value = `${ta.value}`;
    //   const count = value.length;
    //   document.getElementById("textCount").innerText = 1000 - count;
    // };

    btns.forEach((btn) =>
      document.getElementById(btn).addEventListener("click", scrollToArea)
    );

    // document
    //   .getElementById("textArea")
    //   .addEventListener("keydown", onTextChange);
  }

  render() {
    window.onload = function () {
      const btns = Object.keys(targetMap);

      btns.forEach((btn) =>
        document.getElementById(btn).addEventListener("click", scrollToArea)
      );
      // document
      //   .getElementById("textArea")
      //   .addEventListener("keydown", onTextChange);
    };

    const scrollToArea = (e) => {
      const id = targetMap[e.target.id];
      document
        .getElementById(id)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // const onSubmit = () => {
    //   const textArea = document.getElementById("textArea");
    //   const value = textArea.value;
    //   const sendVal = encodeURIComponent(value);
    //   fetch(
    //     `https://www.mapper.bike/api/sbmt/submission/BikssesBeersBaby3a58a6bc3f6a?segment=${sendVal}`,
    //     { method: "GET", mode: "cors" }
    //   )
    //     .then((response) => response.json())
    //     .then(endSubmit)
    //     .catch(endSubmit);
    // };

    // const endSubmit = () => {
    //   document.getElementById("submitArea").classList.add("hideElm");
    //   document.getElementById("allDone").classList.remove("hideElm");
    //   document.getElementById("submitArea").classList.remove("flexCol");
    //   document.getElementById("allDone").classList.add("flexCol");
    //   document.getElementById("textArea").value = "";
    // };

    // const bringTextBack = () => {
    //   document.getElementById("submitArea").classList.remove("hideElm");
    //   document.getElementById("allDone").classList.add("hideElm");
    //   document.getElementById("submitArea").classList.add("flexCol");
    //   document.getElementById("allDone").classList.remove("flexCol");
    // };

    // const onTextChange = () => {
    //   const ta = document.getElementById("textArea");
    //   if (ta) {
    //     const value = `${ta.value}`;
    //     const count = value.length;
    //     document.getElementById("textCount").innerText = 1000 - count;
    //   }
    // };

    // setInterval(onTextChange, 450);

    let countdown;

    setInterval(() => {
      const start = new Date("May 26 2023");
      const end = new Date();

      let duration = intervalToDuration({
        start,
        end,
      });
      countdown = formatDuration(duration, {
        delimiter: ", ",
      });
      document.getElementById("countdown").innerText = countdown;
    }, 1000);

    return (
      <div className="root">
        <section className="landingSection">
          <div className="logo">
            <Link to="/beta">
              <LogoV1 id="logo" />
            </Link>
            <h3 id="countdown">{countdown}</h3>
            <h2 className="h2Landing">Coming May 26th, 2023</h2>
          </div>
          {/* <Link to="/beta"> */}
          <div
            style={{
              backgroundColor: "#FC4C02",
              padding: 20,
            }}
            // className="button"
          >
            Beta now closed. Pre-reg opening soon.
          </div>
          {/* </Link> */}
          <div id="infoBtn" className="button">
            Info
          </div>
          <a
            className="landingLink"
            href="https://www.instagram.com/sbmtchallenge/"
          >
            <div>
              <Insta id="insta" />
            </div>
          </a>
          <div>
            <a
              className="landingLink"
              href="https://www.strava.com/clubs/1051955"
            >
              {/* <img alt="rabble" id="stravaIco" src="./assets/stravaLogo.svg" /> */}
              <StravaLogo id="stravaIco" />
            </a>
          </div>
          <div></div>
        </section>
        <section className="landingSection" id="infoSection">
          <h1 className="h1Landing">
            What is <span className="sbmt">SBMT</span> ?
          </h1>
          <article className="articleLanding">
            Inspired by the
            <a
              className="landingLink padding"
              href="http://www.smmtchallenge.com"
            >
              Santa Monica Mountain Challenge
            </a>
            the <span className="sbmt">SBMT</span> is the same idea here in
            Santa Barbara. <br />
            We'll have a list of 10-15 local cycling climbs and a leaderboard
            running. Starts Memorial Day weekend and runs til just before labor
            day weekend
            <br />
            <br />
            Ranking is done 1st by number of segments completed, then total
            cumulative time. <br />
            <br />
            We'll have plenty of sub categories so you can compete against
            people you're competitive with.
            <br />
            <br />I discovered the SMMT during COVID and really enjoyed it, plus
            it got me to some areas of the Santa Monicas I probably wouldn't
            have done otherwise. Hoping to bring something similar to SB!
            <br />
            <br />
            <br />
          </article>

          <div id="contributeBtn2" className="button">
            Feedback / Contribute
          </div>
        </section>
        <section className="landingSection" id="contributeSection">
          <h1 className="h1Landing">Contribute</h1>
          <article className="articleLanding">
            <div>
              <ul>
                <li>Have a segment suggestion?</li>
                <li>Want to help with coding / designing?</li>
                <li>Have any feedback or ideas for how to make this fun?</li>
                <li>Got a good recipe you'd like to share?</li>
              </ul>
            </div>
            <div className="contactList">
              <a
                className="landingLink"
                href="https://www.instagram.com/sbmtchallenge/"
              >
                @sbmtchallenge
              </a>
              <a className="landingLink" href="mailTo:Sam.Selfridge@gmail.com">
                Sam.Selfridge@gmail.com
              </a>
            </div>
            {/* <div className="flexCol" id="submitArea">
              <textarea
                id="textArea"
                placeholder="Message here..."
                maxLength="1000"
                onChange={onTextChange}
              ></textarea>
              <span className="characterCount">
                <span id="textCount">1000</span> characters remaining
              </span>
              <div className="button" onClick={onSubmit}>
                Submit
              </div>
            </div>
            <div className="hideElm" id="allDone">
              <span>
                Thanks for your submission! <br />
                If you left contact info I'll get back to you.
              </span>
              <div className="button" onClick={bringTextBack}>
                Wait, I had more...
              </div>
            </div> */}
          </article>
        </section>
        {/* <section className="landingSection" id="segmentList">
          <h1 className="h1Landing">Segments</h1>

          <article className="articleLanding">
            <h3>Road</h3>
            <table className="landingTable">
              <thead>
                <tr>
                  <th className="landingTh">No.</th>
                  <th className="landingTh">Name</th>
                  <th className="landingTh">KOM</th>
                  <th className="landingTh">Miles</th>
                  <th className="landingTh">Elevation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="landingTd">1</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/658277"}
                    >
                      Gibraltar
                    </a>
                  </td>
                  <td className="landingTd">0:27:12</td>
                  <td className="landingTd">6.14</td>
                  <td className="landingTd">2593</td>
                </tr>
                <tr>
                  <td className="landingTd">2</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/1290381"}
                    >
                      OSM
                    </a>
                  </td>
                  <td className="landingTd">0:12:58</td>
                  <td className="landingTd">2.97</td>
                  <td className="landingTd">1165</td>
                </tr>
                <tr>
                  <td className="landingTd">3</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/637362"}
                    >
                      Painted Cave
                    </a>
                  </td>
                  <td className="landingTd">0:15:44</td>
                  <td className="landingTd">3.52</td>
                  <td className="landingTd">1336</td>
                </tr>
                <tr>
                  <td className="landingTd">4</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/881465"}
                    >
                      Ladera
                    </a>
                  </td>
                  <td className="landingTd">0:04:23</td>
                  <td className="landingTd">0.86</td>
                  <td className="landingTd">496</td>
                </tr>
                <tr>
                  <td className="landingTd">5</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/631703"}
                    >
                      Farren Road
                    </a>
                  </td>
                  <td className="landingTd">0:06:59</td>
                  <td className="landingTd">2.01</td>
                  <td className="landingTd">508</td>
                </tr>
                <tr>
                  <td className="landingTd">6</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/3596686"}
                    >
                      Tunnel Rd
                    </a>
                  </td>
                  <td className="landingTd">0:10:43</td>
                  <td className="landingTd">1.92</td>
                  <td className="landingTd">647</td>
                </tr>
                <tr>
                  <td className="landingTd">7</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/29015105"}
                    >
                      Roundabout to Mtn
                    </a>
                  </td>
                  <td className="landingTd">0:13:22</td>
                  <td className="landingTd">2.91</td>
                  <td className="landingTd">710</td>
                </tr>
                <tr>
                  <td className="landingTd">8</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/618305"}
                    >
                      Toro Canyon Full
                    </a>
                  </td>
                  <td className="landingTd">0:14:14</td>
                  <td className="landingTd">2.17</td>
                  <td className="landingTd">1194</td>
                </tr>
                <tr>
                  <td className="landingTd">9</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/1313"}
                    >
                      First Casitas Pass
                    </a>
                  </td>
                  <td className="landingTd">0:08:16</td>
                  <td className="landingTd">2.5</td>
                  <td className="landingTd">730</td>
                </tr>
                <tr>
                  <td className="landingTd">10</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/1315"}
                    >
                      Second Casitas Pass
                    </a>
                  </td>
                  <td className="landingTd">0:04:30</td>
                  <td className="landingTd">1.33</td>
                  <td className="landingTd">404</td>
                </tr>
                <tr>
                  <td className="landingTd">11</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/5106261"}
                    >
                      Casitas Climb (rear)
                    </a>
                  </td>
                  <td className="landingTd">0:12:25</td>
                  <td className="landingTd">4.42</td>
                  <td className="landingTd">654</td>
                </tr>
                <tr>
                  <td className="landingTd">12</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/12039079"}
                    >
                      Sycamore Coyote
                    </a>
                  </td>
                  <td className="landingTd">0:11:19</td>
                  <td className="landingTd">2.22</td>
                  <td className="landingTd">736</td>
                </tr>
                <tr>
                  <td className="landingTd">13</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/813814"}
                    >
                      Arroyo Burro to La Cumbre
                    </a>
                  </td>
                  <td className="landingTd">0:12:10</td>
                  <td className="landingTd">2.67</td>
                  <td className="landingTd">879</td>
                </tr>
                <tr>
                  <td className="landingTd">14</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href={"https://www.strava.com/segments/751029"}
                    >
                      Las Alturas
                    </a>
                  </td>
                  <td className="landingTd">0:05:35</td>
                  <td className="landingTd">1.3</td>
                  <td className="landingTd">597</td>
                </tr>
              </tbody>
            </table>
            <h3>Gravel</h3>
            <table className="landingTable">
              <thead>
                <tr>
                  <th className="landingTh">No.</th>
                  <th className="landingTh">Name</th>
                  <th className="landingTh">KOM</th>
                  <th className="landingTh">Miles</th>
                  <th className="landingTh">Elevation</th>
                  <th className="landingTh"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="landingTd">1</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href="https://www.strava.com/segments/746977"
                    >
                      Angostura
                    </a>
                  </td>
                  <td className="landingTd">0:31:27</td>
                  <td className="landingTd">5.89</td>
                  <td className="landingTd">1738</td>
                </tr>
                <tr>
                  <td className="landingTd">2</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href="https://www.strava.com/segments/647251"
                    >
                      Romero
                    </a>
                  </td>
                  <td className="landingTd">0:36:01</td>
                  <td className="landingTd">6.09</td>
                  <td className="landingTd">2178</td>
                </tr>
                <tr>
                  <td className="landingTd">3</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href="https://www.strava.com/segments/2622235"
                    >
                      Arroyo Burro
                    </a>
                  </td>
                  <td className="landingTd">0:33:30</td>
                  <td className="landingTd">5.3</td>
                  <td className="landingTd">1944</td>
                </tr>
                <tr>
                  <td className="landingTd">4</td>
                  <td className="landingTd">
                    <a
                      className="landingLink"
                      href="https://www.strava.com/segments/641588"
                    >
                      Refugio Ocean side
                    </a>
                  </td>
                  <td className="landingTd">0:58:14</td>
                  <td className="landingTd">12.43</td>
                  <td className="landingTd">3838</td>
                </tr>
              </tbody>
            </table>
            <div id="postSegmentText">
              Did I miss one?
              <div id="letMeKnow" className="button">
                Let me know!!
              </div>
            </div>
          </article>
        </section> */}
      </div>
    );
  }
}
