import { Icon, Table } from "tabler-react";
import { Button, IconLayout, ReferrerLayout, Textarea } from "./styles";
import React, { useState } from "react";
import { _post } from "../../common/httpClient";
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

export const ThumbStatusComponent = (props) => {
  return (
    <IconLayout
      state={props.cfaAPrisContact ? "up" : "down"}
      disabled={props.disabled}
      onClick={(event) => props.onToggle(event)}
    >
      {props.cfaAPrisContact ? (
        <Icon prefix="fe" name="fe fe-thumbs-up" />
      ) : (
        <Icon prefix="fe" name="fe fe-thumbs-down" />
      )}
    </IconLayout>
  );
};

export const AppointmentItemList = (props) => {
  const [showEditionMode, setShowEditionMode] = useState(false);
  const [cfaAPrisContact, setCfaAPrisContact] = useState(props.request.cfa_pris_contact_candidat);
  const [champsLibreStatut, setChampsLibreStatut] = useState(props.request.champs_libre_status || "");
  const [champsLibreCommentaires, setChampsLibreCommentaires] = useState(props.request.champs_libre_commentaire || "");

  const onToggleIconThumb = (event) => {
    event.preventDefault();
    if (showEditionMode) {
      setCfaAPrisContact(!cfaAPrisContact);
    }
  };

  const editAppointment = async (appointmentId) => {
    const values = {
      appointmentId,
      cfaAPrisContact,
      champsLibreStatut,
      champsLibreCommentaires,
    };
    await _post("/api/appointment/edit", values);
  };

  const canCelModeEdition = () => {
    setCfaAPrisContact(props.request.cfa_pris_contact_candidat);
    setChampsLibreStatut(props.request.champs_libre_status || "");
    setChampsLibreCommentaires(props.request.champs_libre_commentaire || "");
  };

  const handleOnClick = (event, buttonName) => {
    event.preventDefault();
    switch (buttonName) {
      case "buttonEdit":
        setShowEditionMode(true);
        break;
      case "buttonValidate":
        setShowEditionMode(false);
        editAppointment(props.request._id);
        break;
      case "buttonCancel":
        setShowEditionMode(false);
        canCelModeEdition();
        break;
      default:
        break;
    }
  };

  return (
    <Table.Row>
      <Table.Col>{props.request._id}</Table.Col>
      <Table.Col>{moment.parseZone(props.request.created_at).format("DD/MM/YYYY HH:mm:ss")}</Table.Col>
      <Table.Col>{props.request.candidat_id}</Table.Col>
      <Table.Col>{props.request.formation_id}</Table.Col>
      <Table.Col>
        <OpenedStatus
          openedCandidat={props.request.email_premiere_demande_candidat_envoye}
          openedCfa={props.request.email_premiere_demande_cfa_envoye}
        />
      </Table.Col>
      <Table.Col>
        <OpenedStatus
          openedCandidat={props.request.email_premiere_demande_candidat_ouvert}
          openedCfa={props.request.email_premiere_demande_cfa_ouvert}
        />
      </Table.Col>
      <Table.Col>
        <ThumbStatusComponent
          cfaAPrisContact={cfaAPrisContact}
          disabled={!showEditionMode}
          onToggle={onToggleIconThumb}
        />
      </Table.Col>
      <Table.Col>
        <ReferrerLayout>
          <span>{props.request.referrer}</span>
        </ReferrerLayout>
      </Table.Col>
      <Table.Col>
        <Textarea type="text" disabled>
          {props.request.motivations}
        </Textarea>
      </Table.Col>
      <Table.Col>
        <Textarea
          type="text"
          disabled={!showEditionMode}
          onChange={(event) => setChampsLibreStatut(event.target.value)}
        >
          {champsLibreStatut}
        </Textarea>
      </Table.Col>
      <Table.Col>
        <Textarea
          type="text"
          disabled={!showEditionMode}
          onChange={(event) => setChampsLibreCommentaires(event.target.value)}
        >
          {champsLibreCommentaires}
        </Textarea>
      </Table.Col>
      <Table.Col>
        <>
          {!showEditionMode && (
            <Button className={"btn btn-primary ml-auto"} onClick={(event) => handleOnClick(event, "buttonEdit")}>
              Passer en mode édition
            </Button>
          )}
          {showEditionMode && (
            <>
              <Button className={"btn btn-primary ml-auto"} onClick={(event) => handleOnClick(event, "buttonValidate")}>
                Valider
              </Button>
              <Button className={"btn btn-secondary ml-auto"} onClick={(event) => handleOnClick(event, "buttonCancel")}>
                Annuler les modifications
              </Button>
            </>
          )}
        </>
      </Table.Col>
    </Table.Row>
  );
};
