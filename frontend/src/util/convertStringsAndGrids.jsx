
export function convertStringsToGrid(stringRows) {

    if (!stringRows) {
        const err = new Error(`No Strings passed`)
        throw err;
    }

    if (!Array.isArray(stringRows)) {
        const err = new Error(`Strings are not in Array`)
        throw err;
    }


    const rows = stringRows.length;
    const cols = 16;
    let grid = Array.from({ length: rows }, () => Array(cols).fill(false));

    stringRows.map((str, rowIndex) => {
        for (let i = 0; i < str.drum_data.length; i++) {
            if (str.drum_data[i].toUpperCase() === "X") {
                grid[rowIndex][i] = true;
            }
        }
    })

    return grid;
}

export function convertGridAndNamesToStrings(grid, drumrows) {
    let stringArrays = []
    grid.map((row, rowIndex) => {
      let tempStr = ""
      row.map((col) => {
        if (col) {
          tempStr = tempStr.concat("X")
        } else {
          tempStr = tempStr.concat("-")
        }
      })
      stringArrays.push({
        row_name: drumrows[rowIndex],
        drum_data: tempStr,
      })
    })
    return stringArrays
}
