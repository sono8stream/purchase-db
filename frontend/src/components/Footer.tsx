import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Segment } from 'semantic-ui-react';

const Footer: React.FC = () => {
  return (
    <Segment style={{ padding: '2em 0em' }} color="teal">
      <Container textAlign="center">
        <Button basic={true} as={Link} color="teal" to="/contact">
          Contact Me
        </Button>
        <Divider />
        <p>Copyright © 2019 sono. All rights reserved.</p>
      </Container>
    </Segment>
  );
};

export default Footer;
