import utils from "../../../utils/executeQuery.js"

async function getTaluka(req, res, callback) {
    try {
        let id = req.params.id;
        let results = await utils.queryExecute(
            "eventService",
            "talukaBasedOnId",
            [id],
            "eventMgmt"
        );
        let data = []
        if(results && results.recordset.length > 0){
            const formattedDate = results.recordset.map((row) =>{
               let object = {
               "talukaId" :row.talukaId,
               "talukaName":row.talukaName
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
        console.log(err);
        const errorResp = {
            statusCode:500,
            statusMessage:"Internal Server Error",
            data:{}
        }
        callback(errorResp)
    }

}

export default {getTaluka}



