import React, { Component } from "react";

import StravaButton from "components/Shared/StravaButton";

// import "./mein.css";
import styles from "./mein.module.css";

import { Link } from "react-router-dom";

import { ReactComponent as LogoV1 } from "./assets/logoV1.svg";
import { ReactComponent as Insta } from "./assets/insta.svg";
import { ReactComponent as StravaLogo } from "./assets/stravaLogo.svg";
import Countdown from "./Countdown";

// console.info("styles: ", styles);
//TODO - scope styles kinda works?!
const targetMap = {
  infoBtn: "infoSection",
  // contributeBtn: "contributeSection",
  contributeBtn2: "contributeSection",
};

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.intervalRef = React.createRef();
  }
  static displayName = LandingPage.name;

  componentDidMount() {
    const btns = Object.keys(targetMap);

    const scrollToArea = (e) => {
      const id = targetMap[e.target.id];
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    // const onTextChange = () => {
    //   const ta = document.getElementById("textArea");
    //   const value = `${ta.value}`;
    //   const count = value.length;
    //   document.getElementById("textCount").innerText = 1000 - count;
    // };

    btns.forEach((btn) => {
      if (btn) {
        document.getElementById(btn)?.addEventListener("click", scrollToArea);
      }
    });
  }

  componentWillUnmount() {}

  render() {
    window.onload = function () {
      const btns = Object.keys(targetMap);

      btns.forEach((btn) =>
        document.getElementById(btn)?.addEventListener("click", scrollToArea)
      );
    };

    const scrollToArea = (e) => {
      const id = targetMap[e.target.id];
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
      <div className={styles.root}>
        <section className={styles.landingSection}>
          <div className={styles.logo}>
            <Link to="/segments">
              <LogoV1 id="logo" />
            </Link>
            <Countdown />
            {/* <h2 className={styles.h2Landing}>Coming May 24th, 2024</h2> */}
          </div>

          <StravaButton />

          <div id="infoBtn" className={`${styles.button}`}>
            Info
          </div>
          <a
            className={styles.landingLink}
            href="https://www.instagram.com/sbmtchallenge/"
          >
            <div>
              <Insta id="insta" className={styles.insta} />
            </div>
          </a>
          <div>
            <a
              className={styles.landingLink}
              href="https://www.strava.com/clubs/1051955"
            >
              {/* <img alt="rabble" id="stravaIco" src="./assets/stravaLogo.svg" /> */}
              <StravaLogo id="stravaIco" />
            </a>
          </div>
          <div></div>
        </section>
        <section className={styles.landingSection} id="infoSection">
          <h1 className={styles.h1Landing}>
            What is <span className={styles.sbmt}>SBMT</span> ?
          </h1>
          <article className={styles.articleLanding}>
            Inspired by the
            <a
              className="landingLink padding"
              href="http://www.smmtchallenge.com"
            >
              Santa Monica Mountain Challenge
            </a>
            the <span className={styles.sbmt}>SBMT</span> is the same idea here
            in Santa Barbara. <br />
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

          <div id="contributeBtn2" className={styles.button}>
            Feedback / Contribute
          </div>
        </section>
        <section className={styles.landingSection} id="contributeSection">
          <h1 className={styles.h1Landing}>Contribute</h1>
          <article className={styles.articleLanding}>
            <div>
              <ul>
                <li>Have a segment suggestion?</li>
                <li>Want to help with coding / designing?</li>
                <li>Have any feedback or ideas for how to make this fun?</li>
                <li>Got a good recipe you'd like to share?</li>
              </ul>
            </div>
            <div className={styles.contactList}>
              <a
                className={styles.landingLink}
                href="https://www.instagram.com/sbmtchallenge/"
              >
                @sbmtchallenge
              </a>
              <a
                className={styles.landingLink}
                href="mailTo:Sam.Selfridge@gmail.com"
              >
                Sam.Selfridge@gmail.com
              </a>
            </div>
            {/* <div className={styles.flexCol} id="submitArea">
              <textarea
                id="textArea"
                placeholder="Message here..."
                maxLength="1000"
                onChange={onTextChange}
              ></textarea>
              <span className={styles.characterCount}>
                <span id="textCount">1000</span> characters remaining
              </span>
              <div className={styles.button} onClick={onSubmit}>
                Submit
              </div>
            </div>
            <div className={styles.hideElm} id="allDone">
              <span>
                Thanks for your submission! <br />
                If you left contact info I'll get back to you.
              </span>
              <div className={styles.button} onClick={bringTextBack}>
                Wait, I had more...
              </div>
            </div> */}
          </article>
        </section>
        {/* <section className={styles.landingSection} id="segmentList">
          <h1 className={styles.h1Landing}>Segments</h1>

          <article className={styles.articleLanding}>
            <h3>Road</h3>
            <table className={styles.landingTable}>
              <thead>
                <tr>
                  <th className={styles.landingTh}>No.</th>
                  <th className={styles.landingTh}>Name</th>
                  <th className={styles.landingTh}>KOM</th>
                  <th className={styles.landingTh}>Miles</th>
                  <th className={styles.landingTh}>Elevation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.landingTd}>1</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/658277"}
                    >
                      Gibraltar
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:27:12</td>
                  <td className={styles.landingTd}>6.14</td>
                  <td className={styles.landingTd}>2593</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>2</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/1290381"}
                    >
                      OSM
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:12:58</td>
                  <td className={styles.landingTd}>2.97</td>
                  <td className={styles.landingTd}>1165</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>3</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/637362"}
                    >
                      Painted Cave
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:15:44</td>
                  <td className={styles.landingTd}>3.52</td>
                  <td className={styles.landingTd}>1336</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>4</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/881465"}
                    >
                      Ladera
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:04:23</td>
                  <td className={styles.landingTd}>0.86</td>
                  <td className={styles.landingTd}>496</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>5</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/631703"}
                    >
                      Farren Road
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:06:59</td>
                  <td className={styles.landingTd}>2.01</td>
                  <td className={styles.landingTd}>508</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>6</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/3596686"}
                    >
                      Tunnel Rd
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:10:43</td>
                  <td className={styles.landingTd}>1.92</td>
                  <td className={styles.landingTd}>647</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>7</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/29015105"}
                    >
                      Roundabout to Mtn
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:13:22</td>
                  <td className={styles.landingTd}>2.91</td>
                  <td className={styles.landingTd}>710</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>8</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/618305"}
                    >
                      Toro Canyon Full
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:14:14</td>
                  <td className={styles.landingTd}>2.17</td>
                  <td className={styles.landingTd}>1194</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>9</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/1313"}
                    >
                      First Casitas Pass
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:08:16</td>
                  <td className={styles.landingTd}>2.5</td>
                  <td className={styles.landingTd}>730</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>10</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/1315"}
                    >
                      Second Casitas Pass
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:04:30</td>
                  <td className={styles.landingTd}>1.33</td>
                  <td className={styles.landingTd}>404</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>11</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/5106261"}
                    >
                      Casitas Climb (rear)
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:12:25</td>
                  <td className={styles.landingTd}>4.42</td>
                  <td className={styles.landingTd}>654</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>12</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/12039079"}
                    >
                      Sycamore Coyote
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:11:19</td>
                  <td className={styles.landingTd}>2.22</td>
                  <td className={styles.landingTd}>736</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>13</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/813814"}
                    >
                      Arroyo Burro to La Cumbre
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:12:10</td>
                  <td className={styles.landingTd}>2.67</td>
                  <td className={styles.landingTd}>879</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>14</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href={"https://www.strava.com/segments/751029"}
                    >
                      Las Alturas
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:05:35</td>
                  <td className={styles.landingTd}>1.3</td>
                  <td className={styles.landingTd}>597</td>
                </tr>
              </tbody>
            </table>
            <h3>Gravel</h3>
            <table className={styles.landingTable}>
              <thead>
                <tr>
                  <th className={styles.landingTh}>No.</th>
                  <th className={styles.landingTh}>Name</th>
                  <th className={styles.landingTh}>KOM</th>
                  <th className={styles.landingTh}>Miles</th>
                  <th className={styles.landingTh}>Elevation</th>
                  <th className={styles.landingTh}></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.landingTd}>1</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href="https://www.strava.com/segments/746977"
                    >
                      Angostura
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:31:27</td>
                  <td className={styles.landingTd}>5.89</td>
                  <td className={styles.landingTd}>1738</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>2</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href="https://www.strava.com/segments/647251"
                    >
                      Romero
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:36:01</td>
                  <td className={styles.landingTd}>6.09</td>
                  <td className={styles.landingTd}>2178</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>3</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href="https://www.strava.com/segments/2622235"
                    >
                      Arroyo Burro
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:33:30</td>
                  <td className={styles.landingTd}>5.3</td>
                  <td className={styles.landingTd}>1944</td>
                </tr>
                <tr>
                  <td className={styles.landingTd}>4</td>
                  <td className={styles.landingTd}>
                    <a
                      className={styles.landingLink}
                      href="https://www.strava.com/segments/641588"
                    >
                      Refugio Ocean side
                    </a>
                  </td>
                  <td className={styles.landingTd}>0:58:14</td>
                  <td className={styles.landingTd}>12.43</td>
                  <td className={styles.landingTd}>3838</td>
                </tr>
              </tbody>
            </table>
            <div id="postSegmentText">
              Did I miss one?
              <div id="letMeKnow" className={styles.button}>
                Let me know!!
              </div>
            </div>
          </article>
        </section> */}
      </div>
    );
  }
}
