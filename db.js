const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/dealers_choice_sequelize_db');
const  { DataTypes: { STRING,  UUID, UUIDV4} } = Sequelize;


const Character = db.define('character', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name : {
        type: STRING(30),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})

const House = db.define('house', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(30),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})

const characters = ['Harry Potter', 'Hermione Granger', 'Ronald Weasley', 'Tom Riddle', 'Luna Lovegood', 'Professor Severus Snape', 'Draco Malfoy'];
const houses = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

House.hasMany(Character);
Character.belongsTo(House);

const syncAndSeed = async () => {
    await db.sync( {force: true} );
    const [harry, hermione, ronald, tom, luna, snape, malfoy] = await Promise.all(characters.map(name => Character.create( {name} )));
    const [gryffindor, slytherin, ravenclaw, hufflepuff] = await Promise.all(houses.map(name => House.create( {name} )));
    harry.houseId = gryffindor.id;
    hermione.houseId = gryffindor.id;
    ronald.houseId = gryffindor.id;
    tom.houseId = slytherin.id;
    luna.houseId = ravenclaw.id;
    snape.houseId = slytherin.id;
    malfoy.houseId = slytherin.id;
    await Promise.all([harry.save(), hermione.save(), ronald.save(), tom.save(), luna.save(), snape.save(), malfoy.save()]);

}

module.exports = {
    syncAndSeed,
    models : {
        Character,
        House
    }
}