const bcrypt = require('bcryptjs');

const hash = '$2b$10$9eLzAp3pShmtO7g1JEB9uuMhZTTeGyz86Yg9urST37SMxhoEobFwW';
const password = 'admin1234';

bcrypt.compare(password, hash).then(result => {
    console.log(`bcrypt.compare('${password}', hash) =`, result);
});
