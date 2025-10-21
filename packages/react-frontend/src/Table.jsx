import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Job</th>
        <th>Remove</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.characterData.map((row, index) => { // doing the return statement for every element in characterData
    return (
      <tr key={row._id ?? index}>
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>{row.job}</td>
        <td>
            <button onClick={() => props.removeCharacter(row._id ?? index)}>
                Delete
            </button>
        </td>
      </tr>
    );
   }
  );
  return (
      <tbody>
        {rows}
       </tbody>
   );
}

function Table(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        characterData={props.characterData}
        removeCharacter={props.removeCharacter}
      />
    </table>
  );
}

export default Table;