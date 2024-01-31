const express = require('express');
const app = express();
require('dotenv').config();
const enaas = require('enaas-retriever');

const startServer = () => {


    require('./utils/db')
    const authRoutes = require('./routes/auth');


    app.use(express.json());

    app.use('/auth', authRoutes);

    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}
 
function secretsLoading() {
    return new Promise((resolve, reject) => {
        enaas.loadSecrets();
        resolve()
    })
}

secretsLoading().then(startServer())

