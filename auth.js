const express = require('express');
const app = express();
const loadConfigSecrets = require('./config/load_config_secrets')

const startServer = () => {
    require('./utils/db')
    const authRoutes = require('./routes/auth');
    app.use(express.json());
    app.use('/auth', authRoutes);
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
 
async function main() {
    await loadConfigSecrets();
    startServer();
}


main()
