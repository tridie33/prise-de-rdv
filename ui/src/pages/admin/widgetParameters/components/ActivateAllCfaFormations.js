import React, { useEffect, useState } from "react";
import { Card, Form, Button, Dimmer } from "tabler-react";
import * as emailValidator from "email-validator";
import { toast } from "react-toastify";
import { _get, _post } from "../../../../common/httpClient";

/**
 * @description Updates all widgetParameters to updates referrers.
 * @returns {JSX.Element}
 */
const ActivateAllCfaFormations = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const [referrers, setReferrers] = useState();
  const [email, setEmail] = useState("");
  const [siret, setSiret] = useState("");

  /**
   * @description Get all parameters.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const referrersResponse = await getReferrers();

        setReferrers(referrersResponse.map((referrer) => ({ ...referrer, isChecked: false })));
      } catch (error) {
        toast.error("Une erreur est survenue durant la récupération des informations.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /**
   * @description Returns all referrers.
   * @returns {Promise<{code: {number}, name: {string}, full_name: {string}, url: {string}[]}>}
   */
  const getReferrers = async () => {
    const { referrers } = await _get(`/api/constants`);

    return referrers;
  };

  /**
   * @description Toggles checkboxes.
   * @param {Number} referrerCode
   * @param {Boolean} isChecked
   * @returns {void}
   */
  const toggleReferrer = (referrerCode, isChecked) => {
    const referrersUpdated = referrers.map((referrer) => {
      if (referrer.code === referrerCode) {
        referrer.isChecked = isChecked;
      }

      return referrer;
    });

    setReferrers(referrersUpdated);
    toggleDisableButton();
  };

  /**
   * @description Disable submit button if no one of checkbox is checked.
   * @returns {void}
   */
  const toggleDisableButton = () => {
    const uncheckedReferrers = referrers.filter((referrer) => !referrer.isChecked);

    setSubmitDisabled(
      uncheckedReferrers.length === referrers.length || !emailValidator.validate(email) || siret.length !== 14
    );
  };

  /**
   * @description Handle "email" changes.
   * @param {Event} event
   * @returns {void}
   */
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
    toggleDisableButton();
  };

  /**
   * @description Handle "siret" changes.
   * @param {Event} event
   * @returns {void}
   */
  const onChangeSiret = (event) => {
    const value = event.target.value;
    if (/^\d+$/.test(value)) {
      setSiret(value);
    }
    toggleDisableButton();
  };

  /**
   * @description Submit.
   * @returns {Promise<void>}
   */
  const submit = async () => {
    try {
      setSubmitLoading(true);
      const { result } = await _post("/api/widget-parameters/import", {
        parameters: [
          {
            siret_formateur: siret,
            email: email,
            referrers: referrers.filter((referrer) => referrer.isChecked).map((referrer) => referrer.code),
          },
        ],
      });

      if (result[0].error) {
        toast.error(result[0].error);
      } else {
        setEmail("");
        setSiret("");

        if (result[0].formations.length > 0) {
          toast.success("Enregistrement effectué avec succès.");
        } else {
          toast.info("Aucune modification n'a été apportée.");
        }
      }

      toggleDisableButton();
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Card title="Activer toutes les formations d'un CFA">
      <Dimmer active={loading} loader>
        <Card.Body>
          Veuillez cocher l'ensemble des plateformes de diffusion sur lesquelles vous souhaitez que les formations du
          SIRET formateur fournies soient activés. Ne sont affecté que les formations sans configurations.
          <br />
          <br />
          {referrers &&
            referrers.map((referrer) => (
              <Form.Checkbox
                key={referrer.code}
                checked={referrer.checked}
                label={referrer.full_name}
                onChange={() => toggleReferrer(referrer.code, !referrer.isChecked)}
              />
            ))}
          <div style={{ marginTop: "2rem" }} />
          <Form.Group>
            <Form.Label>Siret formateur</Form.Label>
            <Form.Input
              name="siret_formateur"
              placeholder="48398606300012"
              maxLength={14}
              onChange={onChangeSiret}
              value={siret}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email de contact</Form.Label>
            <Form.Input name="email_contact" placeholder="exemple@cfa.fr" onChange={onChangeEmail} value={email} />
          </Form.Group>
        </Card.Body>
      </Dimmer>
      <Card.Footer>
        <Button color="primary float-right" disabled={isSubmitDisabled} loading={submitLoading} onClick={submit}>
          Enregistrer
        </Button>
      </Card.Footer>
    </Card>
  );
};

export { ActivateAllCfaFormations };
