const path = require('path');
const Portfolio = require(path.resolve(__dirname, 'server/models/Portfolio.js'));
const { sequelize } = require(path.resolve(__dirname, 'server/config/database.js'));

async function inspect() {
    try {
        const portfolios = await Portfolio.findAll();
        console.log('--- Database Inspection ---');
        console.log(`Total portfolios: ${portfolios.length}`);

        portfolios.forEach(p => {
            const data = p.get({ plain: true });
            console.log(`\nID: ${data.id}`);
            console.log(`Title: ${data.title}`);
            console.log(`Is Published: ${data.isPublished}`);
            console.log(`File JSON: ${JSON.stringify(data.file, null, 2)}`);

            const hasFile = !!(data.file && (data.file.path || data.file.filename));
            console.log(`hasFile Calc: ${hasFile}`);
        });

    } catch (err) {
        console.error('Error during inspection:', err);
    } finally {
        process.exit();
    }
}

inspect();
