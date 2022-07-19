import {
  useLocation,
  useMatch,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Invoices(props) {
  // console.info("invoice props: ", props);

  // const location = useLocation();
  // console.info("location: ", location);

  // const match = useMatch("/invoices/:extra");
  // console.info("match: ", match);

  // const params = useParams();
  // console.info("params: ", params);
  // const searchParams = useSearchParams();
  // console.info("searchparams: ", searchParams);

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Invoices</h2>
      <Outlet />
    </main>
  );
}
