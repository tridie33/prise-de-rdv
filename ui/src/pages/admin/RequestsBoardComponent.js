import { Card, Grid, Table } from "tabler-react";
import React from "react";
import { AppointmentItemList } from "./AppointmentItemList";

export const RequestsBoardComponent = (props) => {
  return (
    <Grid.Row>
      <Grid.Col width={12}>
        <Card title="Demandes">
          <Table responsive className="card-table table-vcenter text-nowrap">
            <Table.Header>
              <Table.Row>
                <Table.ColHeader>ID</Table.ColHeader>
                <Table.ColHeader>Date</Table.ColHeader>
                <Table.ColHeader>Candidat</Table.ColHeader>
                <Table.ColHeader>Centre</Table.ColHeader>
                <Table.ColHeader>Réceptions</Table.ColHeader>
                <Table.ColHeader>Ouvertures</Table.ColHeader>
                <Table.ColHeader>Prise de contact</Table.ColHeader>
                <Table.ColHeader>Site de provenance</Table.ColHeader>
                <Table.ColHeader>Motivations du candidat</Table.ColHeader>
                <Table.ColHeader>Champs libre statut</Table.ColHeader>
                <Table.ColHeader>Champs libre commentaires</Table.ColHeader>
                <Table.ColHeader>Actions</Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {props.appointments.map((appointment, index) => (
                <AppointmentItemList key={appointment._id} appointment={appointment} index={index} />
              ))}
            </Table.Body>
          </Table>
        </Card>
      </Grid.Col>
    </Grid.Row>
  );
};
