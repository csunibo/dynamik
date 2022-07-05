import * as React from "react";
import { Link } from "react-router-dom";

import { Teachings } from "../const";

const Home: React.FC = () => (
  <div>
    <h1>Home</h1>
    {Object.values(Teachings).map((teaching, i) => (
      <Link key={i} to={`/${teaching}`}>
        {teaching}
      </Link>
    ))}
  </div>
);

export default Home;
