export const bodyControl = (req, res, next) => {
    if (res.status === 400) {
        res.json({ msg: "Bad Request" })
    } else {
        next()
    }
}
