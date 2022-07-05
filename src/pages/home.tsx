import * as React from "react";
import { Link } from "react-router-dom";

import { Teachings } from "../const";
import Fuzzy from "../components/fuzzy";

const Home: React.FC = () => (
  <div>
    <h1>Home</h1>
    <ul>
      {Object.values(Teachings).map((teaching, i) => (
        <li key={i}>
          <Link to={`/${teaching}`}>{teaching}</Link>
        </li>
      ))}
    </ul>
    <Fuzzy />
  </div>
);

export default Home;
