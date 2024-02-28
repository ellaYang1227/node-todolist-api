function errHandle(res) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        "status": false,
        "message": "欄位格式錯誤或沒有此 todo Id"
    }));
    res.end();
}

module.exports = errHandle;