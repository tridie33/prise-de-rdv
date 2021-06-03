import React, { useEffect, useState } from "react";
import { Grid, Card, Form, Button, Dimmer } from "tabler-react";
import { toast } from "react-toastify";
import { _get, _put } from "../../../../common/httpClient";

/**
 * @description Updates all widgetParameters to updates referrers.
 * @returns {JSX.Element}
 */
const UpdateAllParameterReferrersComponent = () => {
  const [loading, setLoading] = useState(false);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const [referrers, setReferrers] = useState();

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

    setSubmitDisabled(uncheckedReferrers.length === referrers.length);
  };

  /**
   * @description Submit.
   * @returns {Promise<void>}
   */
  const submit = () =>
    _put("/api/widget-parameters/referrers", {
      referrers: referrers.filter((referrer) => referrer.isChecked).map((referrer) => referrer.code),
    });

  return (
    <Grid.Row>
      <Grid.Col width={6}>
        <Card title="Modifier les sources de parution pour tous les paramètres actifs">
          <Dimmer active={loading} loader>
            <Card.Body>
              Veuillez cocher l'ensemble des plateformes de diffusion sur lesquelles vous souhaitez que les formations
              actuellement publiées soient accessibles.
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
            </Card.Body>
          </Dimmer>
          <Card.Footer>
            <Button color="primary float-right" disabled={isSubmitDisabled} onClick={submit}>
              Enregistrer
            </Button>
          </Card.Footer>
        </Card>
      </Grid.Col>
    </Grid.Row>
  );
};

export { UpdateAllParameterReferrersComponent };
