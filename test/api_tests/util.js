const buildHTTP = (method, data) => {
    let headers = {
        'Origin': '',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    return {
        method,
        headers,
        body: JSON.stringify(data)
    }
}

function handleHttpErrors(res) {
    if (!res.ok) {
        throw { message: res.statusText, status: res.status };
    }
    return res.json();
}

module.exports = {
    buildHTTP,
    handleHttpErrors
}