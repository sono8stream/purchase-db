import * as React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

interface Props {
  active: string;
}

const AppBar: React.FC<Props> = ({ active }) => {
  const pages: { name: string; to: string; text: string }[] = [
    { name: 'home', to: '/', text: 'Home' },
    { name: 'about', to: '/about', text: 'About' },
    { name: 'product', to: '/product', text: 'Product' },
    { name: 'techblog', to: '/techblog', text: 'Tech Blog' },
    { name: 'diary', to: '/diary', text: 'Diary' },
  ];

  return (
    <>
      <Menu fixed="top" inverted color="teal" style={{ overflow: 'auto' }}>
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
    </>
  );
};

export default AppBar;
