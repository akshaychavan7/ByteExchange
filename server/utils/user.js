const User = require("../models/users");

const updateReputation = async (upvoteBool, uid) => {
    try {
        let user = await User.findOne({_id: uid});
        if(upvoteBool) {
            user['reputation'] = user['reputation'] + 10;
        }
        else {
            if(user['reputation'] <= 10) {
                user['reputation'] = 0;
            }
            else {
                user['reputation'] = user['reputation'] - 10;
            }
        }
        await user.save();
    }
    catch (err) {
        return new Error(`Error in updating reputation of user: ${err}`);
    }
}

module.exports = {updateReputation};