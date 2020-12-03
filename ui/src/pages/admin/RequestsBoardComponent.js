import { Button, Card, Form, Grid, Icon, Table, Text } from "tabler-react";
import React from "react";
const moment = require("moment");

const OpenedStatus = (props) => {
  const styleOpenedStatusCandidat = props.openedCandidat ? "bg-success" : "bg-error";
  const styleOpenedStatusCfa = props.openedCfa ? "bg-success" : "bg-error";
  return (
    <div>
      <React.Fragment>
        <span className={"status-icon " + styleOpenedStatusCandidat} /> Candidat
      </React.Fragment>
      <br />
      <React.Fragment>
        <span className={"status-icon " + styleOpenedStatusCfa} /> CFA
      </React.Fragment>
    </div>
  );
};

export const RequestsBoardComponent = (props) => {
  const rowBuilder = (request) => {
    return {
      key: request._id,
      item: [
        {
          content: (
            <Text RootComponent="span" muted>
              {request._id}
            </Text>
          ),
        },
        { content: moment.utc(request.created_at).format("DD/MM/YYYY HH:mm:ss") },
        { content: `${request.candidat_id}` },
        { content: `${request.formation_id}` },
        {
          content: (
            <OpenedStatus
              openedCandidat={request.email_premiere_demande_candidat_recu}
              openedCfa={request.email_premiere_demande_cfa_recu}
            />
          ),
        },{
          content: (
            <OpenedStatus
              openedCandidat={request.email_premiere_demande_candidat_ouvert}
              openedCfa={request.email_premiere_demande_cfa_ouvert}
            />
          ),
        },
        {
          content: (
            <Text RootComponent="span">
              {request.cfa_pris_contact_candidat ? (
                <Icon prefix="fe" name="fe fe-thumbs-up" />
              ) : (
                <Icon prefix="fe" name="fe fe-thumbs-down" />
              )}
            </Text>
          ),
        },
        { content: `${request.referrer}` },
        {
          content: (
            <Form.Textarea type="text" disabled>
              {request.motivations}
            </Form.Textarea>
          ),
        },
        { content: <Form.Textarea type="text" disabled /> },
        { content: <Form.Textarea type="text" disabled /> },
        { content: "" },
        { content: <Button className={"btn btn-primary ml-auto"} disabled>Editer</Button> },
      ],
    };
  };

  return (
    <Grid.Row>
      <Grid.Col width={12}>
        <Card title="Demandes">
          <Table
            responsive
            className="card-table table-vcenter text-nowrap"
            headerItems={[
              { content: "ID", className: "w-1" },
              { content: "Date" },
              { content: "Candidat" },
              { content: "CFA" },
              { content: "Réception" },
              { content: "Ouvertures" },
              { content: "Prise de contact ?" },
              { content: "Site de provenance" },
              { content: "Motivations du candidat" },
              { content: "Champs libre statut" },
              { content: "Commentaires" },
              { content: "" },
              { content: "" },
            ]}
            bodyItems={props.requests.map((request) => rowBuilder(request))}
          />
        </Card>
      </Grid.Col>
    </Grid.Row>
  );
};
