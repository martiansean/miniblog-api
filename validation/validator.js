module.exports = {
    validate: function (req) {
        let error = []
        if (!req.body.name) {
            error.push({ message: "name is required" })
        }
        if (!req.body.status) {
            error.push({ message: "status is requried" })
        }
        if (!req.body.content) {
            error.push({ message: "content is required" })
        }
        if (!req.body.category) {
            error.push({ message: "category is required" })
        }
        if (error.length > 0) {
            return error
        } else {
            return false
        }
    }
}
