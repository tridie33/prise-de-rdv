import PropTypes from "prop-types";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Grid } from "tabler-react";

/**
 * @description Drag and drop component.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FileDropzone = (props) => {
  const { maxFiles, onDrop, accept, children } = props;

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept, maxFiles });

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <Grid.Row>
        <Grid.Col md={4} />
        <Grid.Col md={4}>
          <div {...getRootProps()} style={{ cursor: "pointer" }}>
            <p align="center">
              <input {...getInputProps()} />
              <img src="/assets/undraw_add_file.svg" height={150} />
            </p>
          </div>
          {children}
        </Grid.Col>
      </Grid.Row>
    </div>
  );
};

FileDropzone.propTypes = {
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  maxFiles: PropTypes.number,
  onDrop: PropTypes.func,
  children: PropTypes.node,
};

FileDropzone.defaultProps = {};

export default FileDropzone;
