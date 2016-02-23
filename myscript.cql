DROP KEYSPACE findadoc;

DESCRIBE KEYSPACES;


CREATE KEYSPACE findadoc WITH REPLICATION={'class':'SimpleStrategy','replication_factor':3};



USE findadoc;

CREATE TABLE findadoc.doctors
  ( doc_id uuid,
    full_name text,
    category text,
    practice_name text,
    street_address text,
    city text,
    state text,
    zip text,
    new_patients boolean,
    graduation_year int,
    PRIMARY KEY(doc_id, category, state, full_name, city)
  );



INSERT INTO doctors (doc_id, full_name, category, practice_name, street_address, city, state, zip, new_patients, graduation_year) VALUES (now(), 'Thomas Smith MD', 'General', 'Family Medical', '50 Main St.', 'Sunnyvale', 'California', '94089', true, 1997);

INSERT INTO doctors (doc_id, full_name, category, practice_name, street_address, city, state, zip, new_patients, graduation_year) VALUES (now(), 'Dennis Philip MD', 'Gynaecologist', 'Family Medical', '12345 Wildwood Ave.', 'Sunnyvale', 'Alaska', '94010', true, 2000);



CREATE TABLE categories
  ( cat_id uuid,
    category_name text,
    PRIMARY KEY(cat_id, category_name)
  );


INSERT INTO categories (cat_id, category_name) VALUES (now(),'General');

INSERT INTO categories (cat_id, category_name) VALUES (now(),'Gynaecologist');

INSERT INTO categories (cat_id, category_name) VALUES (now(),'Pediatrician');


-- CREATE INDEX  CATEGORY_INDEX on findadoc.doctors(category);

--Creating index for column 'state' to query the table 'doctors' using 'state'. Otherwise, we will get for omiting other PRIMARY KEYS
CREATE INDEX STATE_INDEX on findadoc.doctors(state);
