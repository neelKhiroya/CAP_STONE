

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

    console.log(grid);

    stringRows.map((str, rowIndex) => {
        for (let i = 0; i < str.length; i++) {
            if (str[i].toUpperCase() === "X") {
                grid[rowIndex][i] = true;
            }
        }
    })

    return grid;
}
