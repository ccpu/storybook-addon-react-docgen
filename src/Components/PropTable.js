import PropTypes from 'prop-types';
import React from 'react';
import PrettyPropType from 'storybook-pretty-props';

import PropVal from './PropVal';

const cell = {
  paddingRight: 20,
  paddingTop: 15,
  paddingBottom: 15,
  verticalAlign: 'top',
  border: 'none'
};

const styles = {
  table: {
    width: '100%',
    margin: '2rem 0',
    borderCollapse: 'collapse'
  },
  header: {
    paddingRight: 20,
    paddingBottom: 10,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 14,
    whiteSpace: 'nowrap',
    border: 'none',
    borderBottom: '1px solid #ccc'
  },

  property: {
    ...cell,
    fontWeight: 500,
    color: '#FF4400'
  },
  propType: {
    ...cell,
    fontWeight: 500,
    maxWidth: '150px',
    overflow: 'auto',
    color: '#66BF3C'
  },
  required: {
    ...cell
  },
  defaultValue: {
    ...cell
  },
  description: {
    ...cell
  }
};

const getName = type => type.displayName || type.name || '';

export const multiLineText = input => {
  if (!input) {
    return input;
  }

  const text = String(input);
  const arrayOfText = text.split(/\r?\n|\r/g);
  const isSingleLine = arrayOfText.length < 2;

  if (isSingleLine) {
    return text;
  }

  return arrayOfText.map((lineOfText, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={`${lineOfText}.${i}`}>
      {i > 0 && <br />} {lineOfText}
    </span>
  ));
};

const determineIncludedPropTypes = (
  propDefinitions,
  excludedPropTypes,
  type
) => {
  if (excludedPropTypes.length === 0) {
    return propDefinitions;
  }

  const name = getName(type);

  return propDefinitions.filter(propDefinition => {
    const propertyName = propDefinition.property;
    const propertyNameAbsolute = `${name}.${propertyName}`;

    return !(
      excludedPropTypes.includes(propertyName) ||
      excludedPropTypes.includes(propertyNameAbsolute)
    );
  });
};

const PropTable = props => {
  const {
    type,
    maxPropObjectKeys,
    maxPropArrayLength,
    maxPropStringLength,
    propDefinitions,
    excludedPropTypes
  } = props;

  if (!type) {
    return null;
  }

  const includedPropDefinitions = determineIncludedPropTypes(
    propDefinitions,
    excludedPropTypes,
    type
  );

  if (includedPropDefinitions.length === 0) {
    return <small>No propTypes defined!</small>;
  }

  const propValueProps = {
    maxPropObjectKeys,
    maxPropArrayLength,
    maxPropStringLength
  };

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.header}>property</th>
          <th style={styles.header}>propType</th>
          <th style={styles.header}>required</th>
          <th style={styles.header}>default</th>
          <th style={styles.header}>description</th>
        </tr>
      </thead>
      <tbody>
        {includedPropDefinitions.map(row => (
          <tr key={row.property}>
            <td style={styles.property}>{row.property}</td>
            <td style={styles.propType}>
              <PrettyPropType propType={row.propType} />
            </td>
            <td style={styles.required}>{row.required ? 'yes' : '-'}</td>
            <td style={styles.defaultValue}>
              {row.defaultValue === undefined ? (
                '-'
              ) : (
                <PropVal val={row.defaultValue} {...propValueProps} />
              )}
            </td>
            <td style={styles.description}>{multiLineText(row.description)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

PropTable.displayName = 'PropTable';

PropTable.defaultProps = {
  type: null,
  propDefinitions: [],
  excludedPropTypes: []
};

PropTable.propTypes = {
  type: PropTypes.object,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
  excludedPropTypes: PropTypes.arrayOf(PropTypes.string),
  propDefinitions: PropTypes.arrayOf(
    PropTypes.shape({
      property: PropTypes.string.isRequired,
      propType: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      required: PropTypes.bool,
      description: PropTypes.string,
      defaultValue: PropTypes.any
    })
  )
};

export default PropTable;
