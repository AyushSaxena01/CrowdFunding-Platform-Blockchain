import react from "react";
import { Menu } from "semantic-ui-react";
import {Link} from '../routes';

const Header = () => {
  return (
    <Menu style={{marginTop:'15px'}}>
      <Link legacyBehavior route='/'>
        <a className="item">CrowdFund</a>
      </Link>

      <Menu.Menu position="right">
      <Link legacyBehavior route='/'>
        <a className="item">Campaigns</a>
      </Link>
      <Link legacyBehavior route='/Campaigns/new'>
        <a className="item">+</a>
      </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
