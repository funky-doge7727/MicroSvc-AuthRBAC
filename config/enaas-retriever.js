const axios = require('axios');
const env = process.env

const apiUrl = `http://${env.ENAAS_API_URL}:${env.ENAAS_PORT}/get-secrets`;

module.exports = {
    loadSecrets: async () => {
        await axios.get(apiUrl)
            .then((response) => {
                const envVars = response.data;
                Object.entries(envVars).map(([key, value]) =>{
                    env[key] = value
                    console.log(`env loaded from enaas: ${key}`)
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

