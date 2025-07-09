import React from "react";
import PropTypes from "prop-types";

function Table({ columns, renderRow, data }) {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
    className: PropTypes.string
  })).isRequired,
  renderRow: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

export default Table;
  