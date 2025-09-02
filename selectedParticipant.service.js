import utils from "../../../utils/executeQuery.js"

async function selectedParticipant(req, res, callback) {
    try {
        let id = req.params.id;
        // let status = req.query.status;
        let results = await utils.queryExecute(
            "eventService",
            "selectedParticipantBasedOnTaluka",
            [id],
            "eventMgmt"
        );
        let data = []
        if(results && results.recordset.length > 0){
            const formattedDate = results.recordset.map((row) =>{
               let object = {
               "ParticipantName" :row.ParticipantName,
               "Phone":row.phoneNumber,
              "conatctId":row.contactId
            };
            
            data.push(object)
            });
            callback({
                statusCode:200,
                statusMessage:"Success",
                "data":data
            });
        }else{
            callback({
                statusCode:400,
                statusMessage:"Failure",
                data:{}
            });
        }
    } catch (err) {
        const errorResp = {
            statusCode:500,
            statusMessage:"Internal Server Error",
            data:{}
        }
        callback(errorResp)
    }

}

export default {selectedParticipant}



