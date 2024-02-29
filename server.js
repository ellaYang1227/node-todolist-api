const http = require('http');
const { v4: uuidv4 } = require('uuid');
const resHanlde = require('./resHanlde');
const headers = require('./headers');
const todos = [];

const requestListener = (req, res) => {
    const { url, method } = req;
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    if (url === '/todos' && method === 'GET') {
        resHanlde(res, 200, todos);
    } else if(url === '/todos' && method === 'POST') {
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                if (title !== undefined) {
                    todos.push({
                        title,
                        id: uuidv4()
                    });
                    resHanlde(res, 200, todos);
                } else {
                    resHanlde(res, 400);
                }
            } catch(error) {
                resHanlde(res, 400);
            }
        });
        
    } else if(url === '/todos' && method === 'DELETE') {
        todos.length = 0;
        resHanlde(res, 200, todos);
    } else if(url.startsWith('/todos/') && method === 'DELETE') {
        const id = url.split('/').pop();
        const index = todos.findIndex(item => item.id === id);
        if(index !== -1) {
            todos.splice(index, 1);
            resHanlde(res, 200, todos);
        } else {
            resHanlde(res, 400);
        }
    } else if(url.startsWith('/todos/') && method === 'PATCH') {
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                const id = url.split('/').pop();
                const index = todos.findIndex(item => item.id === id);
                if (title !== undefined && index !== -1) {
                    todos[index].title = title;
                    resHanlde(res, 200, todos);
                } else {
                    resHanlde(res, 400);
                }
            } catch(err) {
                resHanlde(res, 400);
            }
        });
    } else if(method === 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else {
        resHanlde(res, 404);
    }
    
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);