import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

interface Props {
  active: string;
}

const AppBar: React.FC<Props> = ({ active }) => {
  const pages: { name: string; to: string; text: string }[] = [];

  const history = useHistory();

  return (
    <Menu fixed="top" inverted color="teal" style={{ overflow: 'auto' }}>
      <Menu.Item
        header={true}
        onClick={() => {
          history.push('/');
        }}
      >
        GameDB!
      </Menu.Item>
      {pages.map((page, index) => (
        <Menu.Item
          key={index}
          name={page.name}
          as={Link}
          to={page.to}
          active={active === page.name}
        >
          {page.text}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default AppBar;
