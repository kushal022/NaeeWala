
export const resSend = (res, status=200, data) => {
    return res.status(status).json(data);
}