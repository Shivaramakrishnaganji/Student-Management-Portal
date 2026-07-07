function Table({ columns, data }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
