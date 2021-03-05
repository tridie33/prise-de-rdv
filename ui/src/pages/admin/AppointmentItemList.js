import React, { useState } from "react";
import { Table } from "tabler-react";
import * as moment from "moment";
import { Button, ReferrerLayout, Textarea } from "./styles";
import { _put } from "../../common/httpClient";
import { REFERER } from "../../common/constants";

export const AppointmentItemList = (props) => {
  const [showEditionMode, setShowEditionMode] = useState(false);
  const [cfaAPrisContact, setCfaAPrisContact] = useState(props.appointment.cfa_pris_contact_candidat);
  const [champsLibreStatut, setChampsLibreStatut] = useState(props.appointment.champs_libre_status || "");
  const [champsLibreCommentaires, setChampsLibreCommentaires] = useState(
    props.appointment.champs_libre_commentaire || ""
  );

  /**
   * @description Updates appointment.
   * @param appointmentId
   * @returns {Promise<*>}
   */
  const editAppointment = (appointmentId) =>
    _put(`/api/appointment/${appointmentId}`, {
      cfa_pris_contact_candidat: cfaAPrisContact,
      champs_libre_status: champsLibreStatut,
      champs_libre_commentaire: champsLibreCommentaires,
    });

  const canCelModeEdition = () => {
    setCfaAPrisContact(props.appointment.cfa_pris_contact_candidat);
    setChampsLibreStatut(props.appointment.champs_libre_status || "");
    setChampsLibreCommentaires(props.appointment.champs_libre_commentaire || "");
  };

  const handleOnClick = (event, buttonName) => {
    event.preventDefault();
    switch (buttonName) {
      case "buttonEdit":
        setShowEditionMode(true);
        break;
      case "buttonValidate":
        setShowEditionMode(false);
        editAppointment(props.appointment._id);
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
      <Table.Col>{moment.parseZone(props.appointment.created_at).format("DD/MM/YYYY HH:mm:ss")}</Table.Col>
      <Table.Col>
        {props.appointment.candidat.firstname} {props.appointment.candidat.lastname}
      </Table.Col>
      <Table.Col>
        <a href={`tel:${props.appointment.candidat.phone}`}>{props.appointment.candidat.phone}</a>
      </Table.Col>
      <Table.Col>
        <a href={`mailto:${props.appointment.candidat.email}`}>{props.appointment.candidat.email}</a>
      </Table.Col>
      <Table.Col>{props.appointment.formation.etablissement.entreprise_raison_sociale}</Table.Col>
      <Table.Col>{props.appointment.etablissement_id}</Table.Col>
      <Table.Col>{props.appointment.formation.formation.intitule}</Table.Col>
      <Table.Col>{props.appointment.formation_id}</Table.Col>
      <Table.Col>
        <ReferrerLayout>
          <span>{REFERER[props.appointment.referrer]}</span>
        </ReferrerLayout>
      </Table.Col>
      <Table.Col>
        <Textarea type="text" disabled>
          {props.appointment.motivations}
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
