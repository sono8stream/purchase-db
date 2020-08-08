import React from 'react';
import PageWrapper from '../components/PageWrapper';
import {
  Form,
  FormField,
  Input,
  Segment,
  Header,
  FormButton,
  Table,
} from 'semantic-ui-react';

const GameEditPage: React.FC = () => {
  return (
    <PageWrapper>
      <Segment>
        <Header>ストアページ</Header>
        <Form>
          <Form>
            <FormField control={Input} label="・ページURL" required />
            <FormButton basic color="blue" content="URLを検証" />
          </Form>
          <FormField control={Input} label="・ストア/製品情報" />
          <FormButton basic color="red" content="ストアを追加" />
        </Form>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ストア/製品情報</Table.HeaderCell>
              <Table.HeaderCell>ストア</Table.HeaderCell>
              <Table.HeaderCell>URL</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Segment>
    </PageWrapper>
  );
};

export default GameEditPage;
