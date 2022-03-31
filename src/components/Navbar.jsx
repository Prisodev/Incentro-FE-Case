import { useHistory } from "react-router-dom";
import Logo from "../assets/logo.svg";

import "./Navbar.css";

export default function Navbar() {
  const history = useHistory();
  const handleClick = () => {
    history.push("/");
  };

  return (
    <nav className='navbar'>
      <ul>
        <li className='logo' onClick={handleClick}>
          <img src={Logo} alt='Incentro logo' />
        </li>
      </ul>
    </nav>
  );
}
