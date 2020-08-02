import * as React from 'react';
import { Container, Segment } from 'semantic-ui-react';

import AppBar from './AppBar';
import Footer from './Footer';

interface Props {
  active: string;
}

class PageWrapper extends React.Component<Props> {
  public static defaultProps: Props = {
    active: 'home',
  };

  public render() {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          //backgroundColor: '#FFEA8C',
        }}
      >
        <AppBar active={this.props.active} />
        <Container
          style={{
            marginTop: '4em',
            flex: 1,
          }}
        >
          {this.props.children}
        </Container>
        <div style={{ height: '1em' }} />
        <Footer />
      </div>
    );
  }
}

export default PageWrapper;
