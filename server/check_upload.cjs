const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

async function inspect() {
    try {
        const [results] = await sequelize.query("SELECT id, title, file, customThumbnail, isPublished FROM Portfolios WHERE title LIKE '%Academic%'");
        console.log(JSON.stringify(results, null, 2));
        await sequelize.close();
    } catch (error) {
        console.error('Inspection failed:', error);
        process.exit(1);
    }
}

inspect();
