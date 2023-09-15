/* Helper functions */
function shuffle_array(array) {
    let len = array.length,
        currentIndex;
    for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
        let randIndex = Math.floor(Math.random() * (currentIndex + 1) );
        var temp = array[currentIndex];
        array[currentIndex] = array[randIndex];
        array[randIndex] = temp;
    }
}

class Tile {
    constructor(value) {
        this.value = value;
    }
}

class Board {
    constructor() {
        this.config = [1, 2, 3, 4,
                        5, 6, 7, 8,
                        9, 10, 11, 12,
                        13, 14, 15, -1];

        this.board = [];
    }

    get_inversion_count() {
        let inv_count = 0;
        for (let i = 0; i < 15; i++) {
            for (let j = i + 1; j < 16; j++) {
                // -1 is the empty tile, so skip it
                if (this.config[j] !== -1 && this.config[i] !== -1 && this.config[i] > this.config[j]) {
                    inv_count++;
                }
            }
        }
        return inv_count;
    }

    is_solvable() {
        const inv_count = this.get_inversion_count();
    
        // Find the row position of the blank tile, counting from the bottom
        const blank_row_from_bottom = 4 - Math.floor(this.find_tile_index(-1) / 4);
    
        // If grid width is odd
        if (inv_count % 2 === 0) {
            return true;
        }
    
        // If grid width is even
        if (blank_row_from_bottom % 2 === 0) {
            return (inv_count % 2 !== 0);
        } else {
            return (inv_count % 2 === 0);
        }
    }

    find_tile_index(value) {
        return this.config.indexOf(value);
    }
    

    init_board() {
        do {
            shuffle_array(this.config);
        } while (!this.is_solvable());

        for (let i = 0; i < 16; i++) {
            this.board.push(new Tile(this.config[i]))
        }
    }

    find_tile_index(value) {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i].value === value) {
                return i;
            }
        }
        return -1;
    }

    is_adjacent(index1, index2) {
        const row1 = Math.floor(index1 / 4);
        const col1 = index1 % 4;
        const row2 = Math.floor(index2 / 4);
        const col2 = index2 % 4;

        const row_diff = Math.abs(row1 - row2);
        const col_diff = Math.abs(col1 - col2);

        return (row_diff === 1 && col_diff === 0) || (row_diff === 0 && col_diff === 1);
    }

    switch_tile(selected_tile_value) {
    const selected_tile_index = this.find_tile_index(selected_tile_value);
    const empty_tile_index = this.find_tile_index(-1);

    if (this.is_adjacent(selected_tile_index, empty_tile_index)) {
            const temp = this.board[selected_tile_index];
            this.board[selected_tile_index] = this.board[empty_tile_index];
            this.board[empty_tile_index] = temp;

            this.config[selected_tile_index] = this.board[selected_tile_index].value;
            this.config[empty_tile_index] = this.board[empty_tile_index].value;
        }
    }


    is_solved() {
        for (let i = 0; i < 15; i++) {
            if (this.board[i].value !== i + 1) {
                return false;
            }
        }
        return this.board[15].value === -1;
    }
}

export default Board;