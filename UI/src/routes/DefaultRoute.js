import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function DefaultRoute(props) {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>404 Bro</h2>
      <Link to="leaderboard">Return to leaderboard</Link>
      <Outlet />
    </main>
  );
}
