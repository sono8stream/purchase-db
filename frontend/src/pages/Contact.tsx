import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection,
  Container,
  Divider,
  Header,
} from 'semantic-ui-react';
import PageWrapper from '../components/PageWrapper';

const Contact = () => {
  return (
    <PageWrapper>
      <Container textAlign="left">
        <Breadcrumb>
          <BreadcrumbSection link as={Link} to="/">
            Top
          </BreadcrumbSection>
          <BreadcrumbDivider icon="right angle" />
          <BreadcrumbSection active>Contact</BreadcrumbSection>
        </Breadcrumb>
      </Container>
      <Divider />
      <Header
        as="h2"
        content="Contact Me"
        subheader="ご意見をお待ちしております"
      />
      <Header textAlign="left" as="h3" content="E-mail" />
      <p>sono888.gamestudio＠gmail.com(＠→@)</p>
      <Header as="h3" content="Twitter" />
      <p>
        <a href="https://twitter.com/_sono_8_">@_sono_8_</a>
      </p>
      <Header as="h3">
        <a
          href="https://github.com/sono8stream/purchase-db"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github repository
        </a>
      </Header>
    </PageWrapper>
  );
};

export default Contact;
