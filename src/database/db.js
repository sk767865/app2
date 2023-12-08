import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('contacts.db');

export const init = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, photo TEXT, mobileNumber TEXT, landlineNumber TEXT, address TEXT);',
                [],
                () => {
                    tx.executeSql(
                        'PRAGMA table_info(contacts);',
                        [],
                        (_, result) => {
                            const columns = result.rows._array.map(c => c.name);
                            if (!columns.includes('favorite')) {
                                tx.executeSql(
                                    'ALTER TABLE contacts ADD COLUMN favorite INTEGER DEFAULT 0;',
                                    [],
                                    () => {
                                        console.log('Favorite column added.');
                                        resolve();
                                    },
                                    (_, err) => {
                                        console.error('Error adding favorite column:', err);
                                        reject(err);
                                    }
                                );
                            } else {
                                console.log('Contacts table is already up-to-date.');
                                resolve();
                            }
                        },
                        (_, error) => {
                            console.error('Error checking columns:', error);
                            reject(error);
                        }
                    );
                },
                (_, err) => {
                    console.error('Error creating or checking contacts table:', err);
                    reject(err);
                }
            );
        });
    });
};

export const insertContact = (name, photo, mobileNumber, landlineNumber, address, favorite) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO contacts (name, photo, mobileNumber, landlineNumber, address, favorite) VALUES (?, ?, ?, ?, ?, ?);',
                [name, photo, mobileNumber, landlineNumber, address, favorite ? 1 : 0],
                (_, result) => {
                    resolve(result.insertId);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const fetchContacts = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM contacts;',
                [],
                (_, result) => {
                    resolve(result.rows._array);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const updateContact = (id, name, mobileNumber, landlineNumber, address, photo, favorite) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE contacts SET name=?, mobileNumber=?, landlineNumber=?, address=?, photo=?, favorite=? WHERE id=?;',
                [name, mobileNumber, landlineNumber, address, photo, favorite ? 1 : 0, id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        resolve(result.rowsAffected);
                    } else {
                        reject(new Error('No contact found with the given ID'));
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const deleteContact = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM contacts WHERE id=?;',
                [id],
                (_, result) => {
                    resolve(result.rowsAffected);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const toggleFavorite = (id, shouldFavorite) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE contacts SET favorite=? WHERE id=?;',
                [shouldFavorite ? 1 : 0, id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        resolve(result.rowsAffected);
                    } else {
                        reject(new Error('No contact found with the given ID'));
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const fetchFavoriteContacts = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM contacts WHERE favorite=1;',
                [],
                (_, result) => {
                    resolve(result.rows._array);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};


export const fetchContactById = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM contacts WHERE id = ?',
                [id],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};


// Calling initialization function to ensure the database and table are created upon app startup
init()
    .then(() => {
        console.log("Database initialization successful");
    })
    .catch((error) => {
        console.log("Database initialization failed", error);
    });



export const updateFavoriteStatus = (id, newStatus) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE contacts SET favorite = ? WHERE id = ?',
                [newStatus, id],
                (_, result) => resolve(result),
                (_, err) => reject(err)
            );
        });
    });

    return promise;
};
