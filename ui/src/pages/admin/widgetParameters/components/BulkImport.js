import React, { useEffect, useState } from "react";
import { Grid, Card, Table, Button, Alert } from "tabler-react";
import { isEqual } from "lodash";
import * as papaparse from "react-papaparse";
import emailValidator from "email-validator";
import FileDropzone from "../../../../common/components/FileDropzone";
import { TableRowHover } from "../../styles";
import { _get, _post } from "../../../../common/httpClient";
import { toast } from "react-toastify";

/**
 * @description Bulk import CFA.
 * @returns {JSX.Element}
 */
const BulkImport = () => {
  const [fileContent, setFileContent] = useState();
  const [error, setError] = useState();
  const [referrers, setReferrers] = useState();
  const [submitLoading, setSubmitLoading] = useState(false);

  const csvHeaders = {
    SIRET_FORMATEUR: "Siret formateur",
    EMAIL_CONTACT: "Email contact",
  };

  const csvMapping = {
    [csvHeaders.SIRET_FORMATEUR]: 0,
    [csvHeaders.EMAIL_CONTACT]: 1,
  };

  /**
   * @description Returns all referrers.
   * @returns {Promise<{code: {number}, name: {string}, full_name: {string}, url: {string}[]}>}
   */
  const getReferrers = async () => {
    const { referrers } = await _get(`/api/constants`);

    return referrers;
  };

  /**
   * @description Get all referrers.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        const referrersResponse = await getReferrers();

        setReferrers(referrersResponse);
      } catch (error) {
        toast.error("Une erreur est survenue durant la récupération des informations.");
      }
    }

    fetchData();
  }, []);

  /**
   * @description Checks if the file is properly structured
   * @param {string[]<string[]>} data
   * @returns {{error: {header: string, content: string}}|null}
   */
  const validFile = (data) => {
    const [headers, ...rows] = data.slice(0, -1);
    const headerColumns = Object.values(csvHeaders);

    if (!isEqual(headerColumns, headers)) {
      return {
        error: {
          header: "Fichier invalide",
          content: `Les colonne du fichier doivent suivren le format: "${Object.values(csvHeaders)}".`,
        },
      };
    }

    if (!rows.length) {
      return { error: { header: "Fichier vide", content: "Aucun élément trouvé." } };
    }

    let rowCounter = 1;

    for (const row of rows) {
      if (row.length !== headerColumns.length) {
        return {
          error: {
            header: "Structure du fichier non valide",
            content: `La ligne "${rowCounter}" doit suivre la structure suivante: "${headerColumns}".`,
          },
        };
      }

      if (!row[csvMapping[csvHeaders.SIRET_FORMATEUR]]) {
        return {
          error: {
            header: "Siret formateur obligatoire",
            content: `La ligne "${rowCounter}" doit contenir un "${csvHeaders.SIRET_FORMATEUR}".`,
          },
        };
      }

      if (row[csvMapping[csvHeaders.SIRET_FORMATEUR]].length !== 14) {
        return {
          error: {
            header: "Siret formateur invalide",
            content: `La ligne "${rowCounter}" doit contenir un "${csvHeaders.SIRET_FORMATEUR}" valide avec 14 numéros.`,
          },
        };
      }

      if (!row[csvMapping[csvHeaders.EMAIL_CONTACT]]) {
        return {
          error: {
            header: "Email de contact obligatoire",
            content: `La ligne "${rowCounter}" doit contenir un "${csvHeaders.EMAIL_CONTACT}".`,
          },
        };
      }

      if (!emailValidator.validate(row[csvMapping[csvHeaders.EMAIL_CONTACT]])) {
        return {
          error: {
            header: "Email de contact invalide",
            content: `La ligne "${rowCounter}" doit contenir un "${csvHeaders.EMAIL_CONTACT}" valide.`,
          },
        };
      }

      rowCounter++;
    }

    return null;
  };

  /**
   * @description Handle onDrop.
   * @param {Object[]} file
   * @returns {void}
   */
  const onDrop = ([file]) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const { data } = papaparse.readString(e.target.result);

      const validationError = validFile(data)?.error;

      if (validationError) {
        setError(validationError);
      } else {
        // False to say "not imported yet"
        setFileContent(data.slice(1, -1).map((item) => [...item, null]));
        setError(null);
      }
    };
    reader.readAsText(file);
  };

  /**
   * @description Cancels importation.
   * @returns {void}
   */
  const cancel = () => setFileContent(null);

  /**
   * @description Submits importation.
   * @returns {Promise<void>}
   */
  const submit = async () => {
    try {
      setSubmitLoading(true);

      const { result } = await _post("/api/widget-parameters/import", {
        parameters: fileContent.map((row) => ({
          siret_formateur: row[csvMapping[csvHeaders.SIRET_FORMATEUR]],
          email: row[csvMapping[csvHeaders.EMAIL_CONTACT]],
          referrers: referrers.map((referrer) => referrer.code),
        })),
      });

      const fileContentUpdated = fileContent.map((row) => {
        const relatedSiret = result.find(
          (item) => item.siret_formateur === row[csvMapping[csvHeaders.SIRET_FORMATEUR]]
        );

        let status = "";
        if (relatedSiret.error) {
          status = relatedSiret.error;
        }

        if (!relatedSiret.error && !relatedSiret.formations.length) {
          status = "Aucunes formation affectés";
        }

        if (!relatedSiret.error && relatedSiret.formations.length) {
          const countFormation = relatedSiret.formations.length;
          if (countFormation === 1) {
            status = `${countFormation} formation a été activé.`;
          } else {
            status = `${countFormation} formations ont été activés.`;
          }
        }

        return [...row.slice(0, -1), status];
      });

      setFileContent(fileContentUpdated);
      toast.success("Import effectué avec succès.");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Grid.Row>
      <Grid.Col width={12}>
        <Card>
          <Card.Header>
            <Card.Title>Activation massive de formations via fichier .csv</Card.Title>
          </Card.Header>

          {error && (
            <Grid.Col width={12} className="mt-6">
              <Alert type="warning" icon="alert-triangle">
                <b>{error.header}</b>
                <br />
                {error.content}
              </Alert>
            </Grid.Col>
          )}

          {!fileContent && (
            <FileDropzone onDrop={onDrop} accept=".csv" maxFiles={1}>
              <p align="center">
                Veuillez importer votre fichier .csv pour activer plusieurs CFA (
                <a href="/docs/exemple-import-cfa.csv">fichier d'exemple</a>).
              </p>
            </FileDropzone>
          )}

          {fileContent && (
            <>
              <Grid.Col width={12}>
                <p align="center" className="my-6">
                  Ci-dessous le récapitulatif des etablissements qui seront activés sur tous les plateformes de
                  diffusion.
                </p>
                <Table responsive className="card-table">
                  <Table.Header>
                    <Table.ColHeader>Siret formateur</Table.ColHeader>
                    <Table.ColHeader>Email</Table.ColHeader>
                    <Table.ColHeader>Importé</Table.ColHeader>
                  </Table.Header>
                  <Table.Body>
                    {fileContent.map((row) => (
                      <TableRowHover>
                        <Table.Col>{row[csvMapping[csvHeaders.SIRET_FORMATEUR]]}</Table.Col>
                        <Table.Col>{row[csvMapping[csvHeaders.EMAIL_CONTACT]]}</Table.Col>
                        <Table.Col>
                          {row[Object.keys(csvMapping).length] === null && "En attente d'enregistrement"}
                          {row[Object.keys(csvMapping).length] !== null && row[Object.keys(csvMapping).length]}
                        </Table.Col>
                      </TableRowHover>
                    ))}
                  </Table.Body>
                </Table>
              </Grid.Col>
              <div className="mb-7" />
              <Card.Footer>
                <Button color="primary float-right" onClick={submit} loading={submitLoading} disabled={submitLoading}>
                  Enregistrer
                </Button>
                <Button color="second float-right" onClick={cancel} loading={submitLoading} disabled={submitLoading}>
                  Annuler
                </Button>
              </Card.Footer>
            </>
          )}
        </Card>
      </Grid.Col>
    </Grid.Row>
  );
};

export { BulkImport };
