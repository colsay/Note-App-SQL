
exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments("id");
        table.string("username");
        table.string("password");
    })
        .then(() => {
            return knex.schema.createTable('users_notes', (table) => {
                table.increments();
                table.string("note");
                table.integer('user_id').unsigned();
                table.foreign('user_id').references('users.id');
            });
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('users')
        .then(() => {
            knex.schema.dropTable('users_notes');
        })
};
