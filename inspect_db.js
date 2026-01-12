const Portfolio = require('./server/models/Portfolio');
const { sequelize } = require('./server/config/database');

async function inspect() {
    try {
        const portfolios = await Portfolio.findAll();
        console.log('--- Database Inspection ---');
        console.log(`Total portfolios: ${portfolios.length}`);

        portfolios.forEach(p => {
            console.log(`\nID: ${p.id}`);
            console.log(`Title: ${p.title}`);
            console.log(`Category: ${p.category}`);
            console.log(`Is Published: ${p.isPublished}`);
            console.log(`File: ${JSON.stringify(p.file, null, 2)}`);

            const portfolioData = p.get({ plain: true });
            const hasFile = !!(portfolioData.file && (portfolioData.file.path || portfolioData.file.filename));
            console.log(`hasFile Calc: ${hasFile}`);
        });

    } catch (err) {
        console.error('Error during inspection:', err);
    } finally {
        process.exit();
    }
}

inspect();
