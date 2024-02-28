const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');
const todos = [];

const requestListener = (req, res) => {
    const { url, method } = req;
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };

    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    if (url === '/todos' && method === 'GET') {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    } else if(url === '/todos' && method === 'POST') {
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                if (title !== undefined) {
                    todos.push({
                        title,
                        id: uuidv4()
                    });
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos
                    }));
                    res.end();
                } else {
                    errHandle(res);
                }
            } catch(error) {
                errHandle(res);
            }
        });
        
    } else if(url === '/todos' && method === 'DELETE') {
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    } else if(url.startsWith('/todos/') && method === 'DELETE') {
        const id = url.split('/').pop();
        const index = todos.findIndex(item => item.id === id);
        if(index !== -1) {
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos
            }));
            res.end();
        } else {
            errHandle(res);
        }
    } else if(url.startsWith('/todos/') && method === 'PATCH') {
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                const id = url.split('/').pop();
                const index = todos.findIndex(item => item.id === id);
                if (title !== undefined && index !== -1) {
                    todos[index].title = title;
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos
                    }));
                    res.end();
                } else {
                    errHandle(res);
                }
            } catch(err) {
                errHandle(res);
            }
        });
    } else if(method === 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": false,
            "message": "找不到路由頁面"
        }));
        res.end();
    }
    
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);