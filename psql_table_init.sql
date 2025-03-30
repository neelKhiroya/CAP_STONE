CREATE TABLE IF NOT EXISTS patterns (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			author VARCHAR(255) NOT NULL,
			username VARCHAR(255) NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drum_rows (
			id SERIAL PRIMARY KEY,
			pattern_id INT NOT NULL,
			row_name VARCHAR(255) NOT NULL,
			drum_data TEXT NOT NULL,
			FOREIGN KEY (pattern_id) REFERENCES patterns(id) ON DELETE CASCADE
);


INSERT INTO patterns (name, author, username, description, created_at)
		VALUES (
            'example_pattern_1', 
            'filler_author_1', 
            'filler_username_1', 
            'filler_description_1', 
            CURRENT_TIMESTAMP
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            1, 
            'example_Kick_drum', 
            'X---X---X---X---'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            1, 
            'example_High_Hat_open', 
            '--X---X---X---X-'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            1, 
            'example_High_Hat_closed', 
            'X-X-X-X-X-X-X-X-'
);


INSERT INTO patterns (name, author, username, description, created_at)
		VALUES (
            'example_pattern_2', 
            'filler_author_2', 
            'filler_username_2', 
            'filler_description_2', 
            CURRENT_TIMESTAMP
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            2, 
            'example_Kick_drum', 
            'X-----X-X---X-X-'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            2, 
            'example_Snare', 
            'X-------X-X-----'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            2, 
            'example_High_Hat_closed', 
            'X-X-XXX-X-XXX-X-'
);


INSERT INTO patterns (name, author, username, description, created_at)
		VALUES (
            'example_pattern_3', 
            'filler_author_3', 
            'filler_username_3', 
            'filler_description_3', 
            CURRENT_TIMESTAMP
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            3, 
            'example_Kick_drum', 
            'X-----X-X---X-X-'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            3, 
            'example_Snare', 
            'X-------X-X-----'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            3, 
            'example_High_Hat_closed', 
            'X-X-XXX-X-XXX-X-'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            3, 
            'example_Clap', 
            '--X------X------'
);


INSERT INTO patterns (name, author, username, description, created_at)
		VALUES (
            'filler_pattern_1', 
            'filler_author_4', 
            'filler_username_4', 
            'filler_description_4', 
            CURRENT_TIMESTAMP
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            4, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            4, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            4, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            4, 
            'filler_drumrow', 
            '----------------'
);


INSERT INTO patterns (name, author, username, description, created_at)
		VALUES (
            'filler_pattern_2', 
            'filler_author_5', 
            'filler_username_5', 
            'filler_description_5', 
            CURRENT_TIMESTAMP
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            5, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            5, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            5, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            5, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            5, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            5, 
            'filler_drumrow', 
            '----------------'
);


INSERT INTO patterns (name, author, username, description, created_at)
		VALUES (
            'filler_pattern_3', 
            'filler_author_6', 
            'filler_username_6', 
            'filler_description_6', 
            CURRENT_TIMESTAMP
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            6, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            6, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            6, 
            'filler_drumrow', 
            '----------------'
);


INSERT INTO patterns (name, author, username, description, created_at)
		VALUES (
            'filler_pattern_4', 
            'filler_author_7', 
            'filler_username_7', 
            'filler_description_7', 
            CURRENT_TIMESTAMP
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            7, 
            'filler_drumrow', 
            '----------------'
);

INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES (
            7, 
            'filler_drumrow', 
            '----------------'
);